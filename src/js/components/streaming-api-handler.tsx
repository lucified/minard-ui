import * as uniq from 'lodash/uniq';
import * as React from 'react';
import { connect } from 'react-redux';

require('event-source-polyfill');

import { toActivities, toBranches, toCommits, toDeployments, toProjects } from '../api/convert';
import {
  ResponseActivityElement,
  ResponseBranchElement,
  ResponseCommitElement,
  ResponseDeploymentElement,
  ResponseProjectElement
} from '../api/types';
import Activities, { Activity } from '../modules/activities';
import Branches, { Branch } from '../modules/branches';
import Commits, { Commit } from '../modules/commits';
import Deployments, { Deployment } from '../modules/deployments';
import Projects, { Project, ProjectUser } from '../modules/projects';
import Streaming, { ConnectionState } from '../modules/streaming';

declare var EventSource: any;

interface GeneratedDispatchProps {
  setConnectionState: (state: ConnectionState, error?: string) => void;
  storeProjects: (projects: Project[]) => void;
  storeCommits: (commits: Commit[]) => void;
  storeActivities: (activities: Activity[]) => void;
  storeBranches: (branches: Branch[]) => void;
  storeDeployments: (deployments: Deployment[]) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, name: string, description?: string) => void;
  addDeploymentToCommit: (commitId: string, deploymentId: string) => void;
  removeBranch: (id: string) => void;
  storeCommitsToBranch: (id: string, commits: Commit[], parentCommits: string[]) => void;
  storeAuthorsToProject: (id: string, authors: ProjectUser[]) => void;
}

// Streaming API types
interface EventSourceEvent {
  data: string;
}

interface EventSourceError {
  target: any;
  type: string;
  bubbles: boolean;
  cancelable: boolean;
  view: any;
  detail: number;
}

interface CodePushResponse {
  after: string;
  before: string;
  commits: ResponseCommitElement[];
  parents: string[];
  branch: ResponseBranchElement | string;
}

interface NewActivityResponse {
  data: ResponseActivityElement;
}

interface DeploymentUpdateResponse {
  commit: string;
  deployment: ResponseDeploymentElement;
}

interface NewProjectResponse {
  data: ResponseProjectElement;
}

interface EditProjectResponse {
  teamId: string;
  projectId: string; // TODO: change to 'id' once server does
  name: string;
  description: string;
}

interface DeleteProjectResponse {
  id: string;
}

let streamingAPIUrl: string = process.env.STREAMING_API || process.env.CHARLES;
if (streamingAPIUrl) {
  // Remove trailing /
  streamingAPIUrl = streamingAPIUrl.replace(/\/$/, '');
  streamingAPIUrl = `${streamingAPIUrl}/events/1`; // TODO: add actual team ID
}

const toConnectionState = (state: any): ConnectionState => {
  switch (state) {
    case EventSource.CONNECTING:
      return ConnectionState.CONNECTING;
    case EventSource.CLOSED:
      return ConnectionState.CLOSED;
    case EventSource.OPEN:
      return ConnectionState.OPEN;
    default:
      throw new Error('Unknown connection state!');
  }
};

// TODO: Remove console.logs
class StreamingAPIHandler extends React.Component<GeneratedDispatchProps, any> {
  private _source: any; // tslint:disable-line

  constructor(props: GeneratedDispatchProps) {
    super(props);

    this.restartConnection = this.restartConnection.bind(this);
    this.changeStateToConnecting = this.changeStateToConnecting.bind(this);
    this.handleCodePush = this.handleCodePush.bind(this);
    this.handleDeploymentUpdate = this.handleDeploymentUpdate.bind(this);
    this.handleNewActivity = this.handleNewActivity.bind(this);
    this.handleProjectCreated = this.handleProjectCreated.bind(this);
    this.handleProjectDeleted = this.handleProjectDeleted.bind(this);
    this.handleProjectEdited = this.handleProjectEdited.bind(this);
  }

  private changeStateToConnecting() {
    if (this._source && this._source.readyState === EventSource.CONNECTING) {
      this.props.setConnectionState(ConnectionState.CONNECTING);
    }
  }

  private handleProjectEdited(e: EventSourceEvent) {
    console.log('project edited', e.data);
    try {
      const response = JSON.parse(e.data) as EditProjectResponse;
      const { projectId: id, name, description } = response;
      this.props.updateProject(id, name, description);
    } catch (e) {
      console.log('Error: Unable to parse Streaming API response for project edited', e.data);
    }
  }

  private handleProjectDeleted(e: EventSourceEvent) {
    console.log('project deleted', e.data);
    try {
      const response = JSON.parse(e.data) as DeleteProjectResponse;
      this.props.removeProject(response.id);
    } catch (e) {
      console.log('Error: Unable to parse Streaming API response for project deleted', e.data);
    }
  }

  private handleProjectCreated(e: EventSourceEvent) {
    console.log('project created', e.data);
    try {
      const response = JSON.parse(e.data) as NewProjectResponse;
      this.props.storeProjects(toProjects(response.data));
    } catch (e) {
      console.log('Error: Unable to parse Streaming API response for project created', e.data);
    }
  }

  private handleDeploymentUpdate(e: EventSourceEvent) {
    console.log('deployment updated', e.data);
    try {
      const response = JSON.parse(e.data) as DeploymentUpdateResponse;
      this.props.storeDeployments(toDeployments(response.deployment));
      this.props.addDeploymentToCommit(response.commit, response.deployment.id);
    } catch (e) {
      console.log('Error: Unable to parse Streaming API response for deployment updated', e.data);
    }
  }

  private handleNewActivity(e: EventSourceEvent) {
    console.log('new activity', e.data);
    try {
      const response = JSON.parse(e.data) as NewActivityResponse;
      this.props.storeActivities(toActivities(response.data));
    } catch (e) {
      console.log('Error: Unable to parse Streaming API response for new activity', e.data);
    }
  }

  private handleCodePush(e: EventSourceEvent) {
    console.log('code pushed', e.data);
    try {
      const response = JSON.parse(e.data) as CodePushResponse;
      if (!after) {
        // branch deleted
        this.props.removeBranch(response.branch as string);

        // TODO: should commits be stored?
        return;
      }

      let branchElement = response.branch as ResponseBranchElement;

      if (!before) {
        // branch created
        this.props.storeBranches(toBranches(branchElement));
      }

      const commits = toCommits(response.commits);
      this.props.storeCommits(commits);
      this.props.storeCommitsToBranch(branchElement.id, commits, response.parents);
      this.props.storeAuthorsToProject(
        branchElement.relationships.project.data.id,
        uniq(commits.map(commit => ({ email: commit.author.email, name: commit.author.name }))),
      );
    } catch (e) {
      console.log('Error: Unable to parse Streaming API response for code pushed', e.data);
    }
  }

  private restartConnection() {
    console.log('opening new streaming connection to', streamingAPIUrl);
    this._source = new EventSource(streamingAPIUrl, { withCredentials: false });

    this._source.addEventListener('error', (e: EventSourceError) => {
      console.log('onerror:', e);
      const source = e.target;
      this.props.setConnectionState(toConnectionState(source.readyState));

      // Once the connection state is CLOSED, the browser will no longer try to reconnect.
      // We'll recreate the EventSource to start the reconnection loop again after 5 seconds.
      if (source.readyState === EventSource.CLOSED) {
        console.log('triggering connection restart');
        this._source.close();
        this._source = null;

        setTimeout(this.restartConnection, 5000); // TODO: smarter retry logic?
      }
    }, false);
    this._source.addEventListener('open', () => {
      console.log('onopen');
      this.props.setConnectionState(ConnectionState.OPEN);
    }, false);
    this._source.addEventListener('message', (e: EventSourceEvent) => {
      // Generic message with no type. Not used.
      console.log('received message:', e.data);
    }, false);

    // TODO: Remove SSE_ prefix once server removes them
    this._source.addEventListener('SSE_PROJECT_CREATED', this.handleProjectCreated, false);
    this._source.addEventListener('SSE_PROJECT_EDITED', this.handleProjectEdited, false);
    this._source.addEventListener('SSE_PROJECT_DELETED', this.handleProjectDeleted, false);
    this._source.addEventListener('SSE_CODE_PUSHED', this.handleCodePush, false);
    this._source.addEventListener('SSE_NEW_ACTIVITY', this.handleNewActivity, false);
    this._source.addEventListener('SSE_DEPLOYMENT_UPDATED', this.handleDeploymentUpdate, false);
    // TODO: handle refresh UI

    if (this._source.readyState === EventSource.CONNECTING) {
      // We set the state to INITIAL_CONNECT at first because we don't want the
      // "connecting..." info dialog to quickly pop up when Minard is loaded.
      this.props.setConnectionState(ConnectionState.INITIAL_CONNECT);
      // Show the "connecting..." dialog if we still haven't connected in 3 seconds.
      setTimeout(this.changeStateToConnecting, 3000);
    } else {
      this.props.setConnectionState(toConnectionState(this._source.readyState));
    }
  }

  public componentWillMount() {
    if (streamingAPIUrl) {
      this.restartConnection();
    }
  }

  public componentWillUnmount() {
    if (this._source) {
      console.log('closing');
      this._source.close();
    }
  }

  public render() {
    return <span />;
  }
};

export default connect<{}, GeneratedDispatchProps, {}>(
  () => ({}),
  {
    setConnectionState: Streaming.actions.setConnectionState,
    updateProject: Projects.actions.updateProject,
    removeProject: Projects.actions.removeProject,
    storeDeployments: Deployments.actions.storeDeployments,
    storeProjects: Projects.actions.storeProjects,
    storeActivities: Activities.actions.storeActivities,
    storeCommits: Commits.actions.storeCommits,
    storeBranches: Branches.actions.storeBranches,
    addDeploymentToCommit: Commits.actions.addDeploymentToCommit,
    removeBranch: Branches.actions.removeBranch,
    storeCommitsToBranch: Branches.actions.storeCommitsToBranch,
    storeAuthorsToProject: Projects.actions.storeAuthorsToProject,
  }
)(StreamingAPIHandler);
