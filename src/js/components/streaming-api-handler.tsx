import * as uniq from 'lodash/uniq';
import * as Raven from 'raven-js';
import * as React from 'react';
import { connect } from 'react-redux';

require('event-source-polyfill');

import { toActivities, toBranches, toCommits, toDeployments, toProjects } from '../api/convert';
import { teamId } from '../api/team-id';
import {
  ResponseActivityElement,
  ResponseBranchElement,
  ResponseCommitElement,
  ResponseDeploymentElement,
  ResponseProjectElement,
} from '../api/types';
import Activities, { Activity } from '../modules/activities';
import Branches, { Branch } from '../modules/branches';
import Commits, { Commit } from '../modules/commits';
import Deployments, { Deployment, DeploymentStatus } from '../modules/deployments';
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
  updateProject: (id: string, name: string, repoUrl: string, description?: string) => void;
  addDeploymentToCommit: (commitId: string, deploymentId: string) => void;
  removeBranch: (id: string) => void;
  storeCommitsToBranch: (id: string, commits: Commit[], parentCommits: string[]) => void;
  storeAuthorsToProject: (id: string, authors: ProjectUser[]) => void;
  addBranchToProject: (id: string, branch: string) => void;
  updateLatestActivityTimestampForProject: (id: string, timestamp: number) => void;
  updateLatestDeployedCommitForProject: (id: string, commit: string) => void;
  updateLatestActivityTimestampForBranch: (id: string, timestamp: number) => void;
  updateLatestDeployedCommitForBranch: (id: string, commit: string) => void;
  removeBranchFromProject: (id: string, branch: string) => void;
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
  commits: ResponseCommitElement[]; // oldest is first
  parents: string[];
  branch: ResponseBranchElement | string;
  project: string;
}

interface NewActivityResponse extends ResponseActivityElement {}

interface DeploymentUpdateResponse {
  commit: string;
  branch: string;
  project: string;
  deployment: ResponseDeploymentElement;
}

interface NewProjectResponse {
  data: ResponseProjectElement;
}

interface EditProjectResponse {
  teamId: string;
  id: string;
  name: string;
  description: string;
  'repo-url': string;
}

interface DeleteProjectResponse {
  teamId: string;
  id: string;
}

let streamingAPIUrl: string = process.env.STREAMING_API || process.env.CHARLES;
if (streamingAPIUrl) {
  // Remove trailing /
  streamingAPIUrl = streamingAPIUrl.replace(/\/$/, '');
  streamingAPIUrl = `${streamingAPIUrl}/events/${teamId}`;
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
    try {
      const response = JSON.parse(e.data) as EditProjectResponse;
      const { id, name, description, 'repo-url': repoUrl } = response;
      this.props.updateProject(id, name, repoUrl, description);
    } catch (e) {
      console.error('Error: Unable to parse Streaming API response for project edited', e.data);
      if (Raven.isSetup()) {
        Raven.captureException(e);
      }
    }
  }

  private handleProjectDeleted(e: EventSourceEvent) {
    try {
      const response = JSON.parse(e.data) as DeleteProjectResponse;
      const { id } = response;
      this.props.removeProject(id);
    } catch (e) {
      console.error('Error: Unable to parse Streaming API response for project deleted', e.data);
      if (Raven.isSetup()) {
        Raven.captureException(e);
      }
    }
  }

  private handleProjectCreated(e: EventSourceEvent) {
    try {
      const response = JSON.parse(e.data) as NewProjectResponse;
      this.props.storeProjects(toProjects(response.data));
    } catch (e) {
      console.error('Error: Unable to parse Streaming API response for project created', e.data);
      if (Raven.isSetup()) {
        Raven.captureException(e);
      }
    }
  }

  private handleDeploymentUpdate(e: EventSourceEvent) {
    try {
      const response = JSON.parse(e.data) as DeploymentUpdateResponse;
      const { deployment: deploymentResponse, commit, project, branch } = response;
      const deployments = toDeployments(deploymentResponse);
      this.props.storeDeployments(deployments);
      this.props.addDeploymentToCommit(commit, deployments[0].id);
      if (deployments[0].status === DeploymentStatus.Success) {
        this.props.updateLatestDeployedCommitForProject(project, commit);
        this.props.updateLatestDeployedCommitForBranch(branch, commit);
      }
    } catch (e) {
      console.error('Error: Unable to parse Streaming API response for deployment updated', e.data);
      if (Raven.isSetup()) {
        Raven.captureException(e);
      }
    }
  }

  private handleNewActivity(e: EventSourceEvent) {
    try {
      const response = JSON.parse(e.data) as NewActivityResponse;
      this.props.storeActivities(toActivities(response));
    } catch (e) {
      console.error('Error: Unable to parse Streaming API response for new activity', e.data);
      if (Raven.isSetup()) {
        Raven.captureException(e);
      }
    }
  }

  private handleCodePush(e: EventSourceEvent) {
    try {
      const response = JSON.parse(e.data) as CodePushResponse;
      const { after, before, commits: commitsResponse, parents, project } = response;

      if (!after) {
        const branchId = response.branch as string;
        // branch deleted
        this.props.removeBranch(branchId);
        this.props.removeBranchFromProject(project, branchId);
        return;
      }

      const branches = toBranches(response.branch as ResponseBranchElement);
      const branch = branches[0];
      const commits = toCommits(commitsResponse.reverse());

      if (!before) {
        // branch created
        this.props.storeBranches(branches);
        this.props.addBranchToProject(branch.project, branch.id);
      }

      this.props.storeCommits(commits);
      this.props.storeCommitsToBranch(branch.id, commits, response.parents);
      this.props.storeAuthorsToProject(
        branch.project,
        uniq(commits.map(commit => ({ email: commit.author.email, name: commit.author.name }))),
      );
      this.props.updateLatestActivityTimestampForProject(branch.project, commits[0].committer.timestamp);
      this.props.updateLatestActivityTimestampForBranch(branch.id, commits[0].committer.timestamp);
    } catch (e) {
      console.error('Error: Unable to parse Streaming API response for code pushed', e.data);
      if (Raven.isSetup()) {
        Raven.captureException(e);
      }
    }
  }

  private restartConnection() {
    this._source = new EventSource(streamingAPIUrl, { withCredentials: false });

    this._source.addEventListener('error', (e: EventSourceError) => {
      console.log('EventSource: error:', e); // tslint:disable-line:no-console
      const source = e.target;
      this.props.setConnectionState(toConnectionState(source.readyState));

      // Once the connection state is CLOSED, the browser will no longer try to reconnect.
      // We'll recreate the EventSource to start the reconnection loop again after 5 seconds.
      if (source.readyState === EventSource.CLOSED) {
        console.log('EventSource: Restarting connection'); // tslint:disable-line:no-console
        this._source.close();
        this._source = null;

        setTimeout(this.restartConnection, 5000); // TODO: smarter retry logic?
      }
    }, false);
    this._source.addEventListener('open', () => {
      this.props.setConnectionState(ConnectionState.OPEN);
    }, false);
    this._source.addEventListener('message', (e: EventSourceEvent) => {
      // Generic message with no type. Not used.
      console.log('received generic message:', e.data); // tslint:disable-line:no-console
    }, false);

    this._source.addEventListener('PROJECT_CREATED', this.handleProjectCreated, false);
    this._source.addEventListener('PROJECT_EDITED', this.handleProjectEdited, false);
    this._source.addEventListener('PROJECT_DELETED', this.handleProjectDeleted, false);
    this._source.addEventListener('CODE_PUSHED', this.handleCodePush, false);
    this._source.addEventListener('NEW_ACTIVITY', this.handleNewActivity, false);
    this._source.addEventListener('DEPLOYMENT_UPDATED', this.handleDeploymentUpdate, false);
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
    storeActivities: Activities.actions.storeActivities,
    removeBranch: Branches.actions.removeBranch,
    storeCommitsToBranch: Branches.actions.storeCommitsToBranch,
    updateLatestDeployedCommitForBranch: Branches.actions.updateLatestDeployedCommit,
    storeBranches: Branches.actions.storeBranches,
    addDeploymentToCommit: Commits.actions.addDeploymentToCommit,
    storeCommits: Commits.actions.storeCommits,
    storeDeployments: Deployments.actions.storeDeployments,
    updateProject: Projects.actions.updateProject,
    removeProject: Projects.actions.removeProject,
    storeProjects: Projects.actions.storeProjects,
    storeAuthorsToProject: Projects.actions.storeAuthorsToProject,
    addBranchToProject: Projects.actions.addBranchesToProject,
    updateLatestActivityTimestampForProject: Projects.actions.updateLatestActivityTimestampForProject,
    updateLatestDeployedCommitForProject: Projects.actions.updateLatestDeployedCommitForProject,
    updateLatestActivityTimestampForBranch: Branches.actions.updateLatestActivityTimestampForBranch,
    removeBranchFromProject: Projects.actions.removeBranchFromProject,
  }
)(StreamingAPIHandler);
