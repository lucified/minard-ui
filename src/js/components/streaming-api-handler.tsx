import { uniq } from 'lodash';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

require('event-source-polyfill');

import { getAccessToken } from '../api/auth';
import { toActivities, toBranches, toComments, toCommits, toDeployments, toProjects } from '../api/convert';
import {
  ResponseActivityElement,
  ResponseBranchElement,
  ResponseCommentElement,
  ResponseCommitElement,
  ResponseDeploymentElement,
  ResponseProjectElement,
} from '../api/types';
import { logException } from '../logger';
import Activities, { Activity } from '../modules/activities';
import Branches, { Branch } from '../modules/branches';
import Comments, { Comment } from '../modules/comments';
import Commits, { Commit } from '../modules/commits';
import Deployments, { Deployment, DeploymentStatus } from '../modules/deployments';
import Projects, { Project, ProjectUser } from '../modules/projects';
import Streaming, { ConnectionState } from '../modules/streaming';
import { Team } from '../modules/user';

declare const EventSource: any;

interface GeneratedDispatchProps {
  setConnectionState: (state: ConnectionState, error?: string) => void;
  storeProjects: (projects: Project[]) => void;
  storeComments: (comments: Comment[]) => void;
  removeComment: (comment: string) => void;
  storeCommits: (commits: Commit[]) => void;
  storeActivities: (activities: Activity[]) => void;
  storeBranches: (branches: Branch[]) => void;
  storeDeployments: (deployments: Deployment[]) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, name: string, repoUrl: string, description?: string) => void;
  addCommentsToDeployment: (id: string, comments: string[]) => void;
  removeCommentFromDeployment: (id: string, comment: string) => void;
  addDeploymentToCommit: (commitId: string, deploymentId: string) => void;
  removeBranch: (id: string) => void;
  updateBranchWithCommits: (id: string, latestCommitId: string, newCommits: Commit[], parentCommits: string[]) => void;
  storeAuthorsToProject: (id: string, authors: ProjectUser[]) => void;
  addBranchToProject: (id: string, branch: string) => void;
  updateLatestActivityTimestampForProject: (id: string, timestamp: number) => void;
  updateLatestDeployedCommitForProject: (id: string, commit: string) => void;
  updateLatestActivityTimestampForBranch: (id: string, timestamp: number) => void;
  updateLatestDeployedCommitForBranch: (id: string, commit: string) => void;
  removeBranchFromProject: (id: string, branch: string) => void;
}

interface PassedProps {
  team?: Team;
  commitHash?: string;
  deploymentId?: string;
}

type Props = PassedProps & GeneratedDispatchProps;

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
  after?: string;
  before?: string;
  commits: ResponseCommitElement[]; // oldest is first
  parents: string[];
  branch: ResponseBranchElement | string;
  project: string;
}

interface NewActivityResponse extends ResponseActivityElement {}

interface CommentCreatedResponse extends ResponseCommentElement {}

interface CommentDeletedResponse {
  comment: string;
  teamId: string;
  deployment: string;
}

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
  streamingAPIUrl = `${streamingAPIUrl}/events`;
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

class StreamingAPIHandler extends React.Component<Props, void> {
  private _source: any;

  constructor(props: Props) {
    super(props);

    this.restartConnection = this.restartConnection.bind(this);
    this.changeStateToConnecting = this.changeStateToConnecting.bind(this);
    this.handleCodePush = this.handleCodePush.bind(this);
    this.handleDeploymentUpdate = this.handleDeploymentUpdate.bind(this);
    this.handleNewActivity = this.handleNewActivity.bind(this);
    this.handleProjectCreated = this.handleProjectCreated.bind(this);
    this.handleProjectDeleted = this.handleProjectDeleted.bind(this);
    this.handleProjectEdited = this.handleProjectEdited.bind(this);
    this.handleCommentCreated = this.handleCommentCreated.bind(this);
    this.handleCommentDeleted = this.handleCommentDeleted.bind(this);
  }

  private changeStateToConnecting() {
    if (this._source && this._source.readyState === EventSource.CONNECTING) {
      this.props.setConnectionState(ConnectionState.CONNECTING);
    }
  }

  private handleProjectEdited(event: EventSourceEvent) {
    try {
      const response = JSON.parse(event.data) as EditProjectResponse;
      const { id, name, description, 'repo-url': repoUrl } = response;
      this.props.updateProject(id, name, repoUrl, description);
    } catch (e) {
      logException('Error: Unable to parse Streaming API response for project edited', e, { event });
    }
  }

  private handleProjectDeleted(event: EventSourceEvent) {
    try {
      const response = JSON.parse(event.data) as DeleteProjectResponse;
      const { id } = response;
      this.props.removeProject(id);
    } catch (e) {
      logException('Error: Unable to parse Streaming API response for project deleted', e, { event });
    }
  }

  private handleProjectCreated(event: EventSourceEvent) {
    try {
      const response = JSON.parse(event.data) as NewProjectResponse;
      this.props.storeProjects(toProjects(response.data));
    } catch (e) {
      logException('Error: Unable to parse Streaming API response for project created', e, { event });
    }
  }

  private handleDeploymentUpdate(event: EventSourceEvent) {
    try {
      const response = JSON.parse(event.data) as DeploymentUpdateResponse;
      const { deployment: deploymentResponse, commit, project, branch } = response;
      const deployments = toDeployments(deploymentResponse);
      this.props.storeDeployments(deployments);
      this.props.addDeploymentToCommit(commit, deployments[0].id);
      if (deployments[0].status === DeploymentStatus.Success) {
        this.props.updateLatestDeployedCommitForProject(project, commit);
        this.props.updateLatestDeployedCommitForBranch(branch, commit);
      }
    } catch (e) {
      logException('Error: Unable to parse Streaming API response for deployment updated', e, { event });
    }
  }

  private handleCommentCreated(event: EventSourceEvent) {
    try {
      const response = JSON.parse(event.data) as CommentCreatedResponse;
      const comments = toComments(response);
      this.props.storeComments(comments);
      this.props.addCommentsToDeployment(comments[0].deployment, comments.map(comment => comment.id));
    } catch (e) {
      logException('Error: Unable to parse Streaming API response for comment created', e, { event });
    }
  }

  private handleCommentDeleted(event: EventSourceEvent) {
    try {
      const response = JSON.parse(event.data) as CommentDeletedResponse;
      this.props.removeCommentFromDeployment(response.deployment, response.comment);
      this.props.removeComment(response.comment);
    } catch (e) {
      logException('Error: Unable to parse Streaming API response for comment deleted', e, { event });
    }
  }

  private handleNewActivity(event: EventSourceEvent) {
    try {
      const response = JSON.parse(event.data) as NewActivityResponse;
      this.props.storeActivities(toActivities(response));
    } catch (e) {
      logException('Error: Unable to parse Streaming API response for new activity', e, { event });
    }
  }

  private handleCodePush(event: EventSourceEvent) {
    try {
      const response = JSON.parse(event.data) as CodePushResponse;
      const { after, before, commits: commitsResponse, parents, project } = response;

      if (!after) {
        const branchId = response.branch as string;
        // branch deleted
        this.props.removeBranchFromProject(project, branchId);
        this.props.removeBranch(branchId);
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

      if (commits.length > 0) {
        this.props.storeCommits(commits);
        this.props.storeAuthorsToProject(
          branch.project,
          uniq(commits.map(commit => ({ email: commit.author.email, name: commit.author.name }))),
        );
      }

      this.props.updateBranchWithCommits(branch.id, after, commits, parents);

      const latestActivityTimestamp: number | undefined = commits.length > 0 ?
        commits[0].committer.timestamp : branch.latestActivityTimestamp;

      if (latestActivityTimestamp) {
        this.props.updateLatestActivityTimestampForProject(branch.project, latestActivityTimestamp);
        this.props.updateLatestActivityTimestampForBranch(branch.id, latestActivityTimestamp);
      }
    } catch (e) {
      logException('Error: Unable to parse Streaming API response for code pushed', e, { event });
    }
  }

  private restartConnection(options: { teamId?: string, deploymentId?: string, commitHash?: string }) {
    const { teamId, deploymentId, commitHash } = options;
    const accessToken = getAccessToken();
    let url: string;

    if (accessToken && teamId) {
      // Logged in, inside the app. Deployment View was not the landing page
      url = `${streamingAPIUrl}/${teamId}?token=${encodeURIComponent(accessToken)}`;
    } else if (accessToken && deploymentId) {
      // Logged in, Deployment View as landing page
      url = `${streamingAPIUrl}/deployment/${encodeURIComponent(deploymentId)}` +
        `?token=${encodeURIComponent(accessToken)}`;
    } else if (deploymentId && commitHash) {
      // Not logged in, in Deployment View
      url = `${streamingAPIUrl}/deployment/${encodeURIComponent(deploymentId)}` +
       `?sha=${encodeURIComponent(commitHash)}`;
    } else {
      console.error('Unable to open stream. Missing credentials.');
      return;
    }

    if (this._source) {
      this._source.close();
    }

    this._source = new EventSource(url, { withCredentials: false });

    this._source.addEventListener('error', (e: EventSourceError) => {
      console.error('EventSource error:', e);
      const source = e.target;
      this.props.setConnectionState(toConnectionState(source.readyState));

      // Once the connection state is CLOSED, the browser will no longer try to reconnect.
      // We'll recreate the EventSource to start the reconnection loop again after 5 seconds.
      if (source.readyState === EventSource.CLOSED) {
        console.log('EventSource: Restarting connection'); // tslint:disable-line:no-console
        this._source.close();
        this._source = null;

        setTimeout(this.restartConnection, 5000, { teamId }); // TODO: smarter retry logic?
      }
    }, false);
    this._source.addEventListener('open', () => {
      this.props.setConnectionState(ConnectionState.OPEN);
    }, false);
    this._source.addEventListener('message', (event: EventSourceEvent) => {
      // Generic message with no type. Not used.
      console.log('received generic message:', event.data); // tslint:disable-line:no-console
    }, false);

    this._source.addEventListener('PROJECT_CREATED', this.handleProjectCreated, false);
    this._source.addEventListener('PROJECT_EDITED', this.handleProjectEdited, false);
    this._source.addEventListener('PROJECT_DELETED', this.handleProjectDeleted, false);
    this._source.addEventListener('CODE_PUSHED', this.handleCodePush, false);
    this._source.addEventListener('NEW_ACTIVITY', this.handleNewActivity, false);
    this._source.addEventListener('DEPLOYMENT_UPDATED', this.handleDeploymentUpdate, false);
    this._source.addEventListener('COMMENT_ADDED', this.handleCommentCreated, false);
    this._source.addEventListener('COMMENT_DELETED', this.handleCommentDeleted, false);
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
    const { team, deploymentId, commitHash } = this.props;

    if (streamingAPIUrl) {
      if (team) {
        this.restartConnection({ teamId: team.id });
      } else if (deploymentId && commitHash) {
        this.restartConnection({ deploymentId, commitHash });
      }
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { team, setConnectionState } = this.props;

    if (streamingAPIUrl) {
      // User logged in or changed teams
      if (nextProps.team && (!team || nextProps.team.id !== team.id)) {
        this.restartConnection({ teamId: nextProps.team.id });
      }

      // User logged out
      if (team && !nextProps.team) {
        setConnectionState(ConnectionState.INITIAL_CONNECT);
        this._source.close();
        this._source = null;
      }
    }
  }

  public componentWillUnmount() {
    if (this._source) {
      this._source.close();
      this._source = null;
    }
  }

  public render() {
    return <span />;
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  // Activities
  storeActivities: (activities: Activity[]) => { dispatch(Activities.actions.storeActivities(activities)); },

  // Branches
  storeBranches: (branches: Branch[]) => { dispatch(Branches.actions.storeBranches(branches)); },
  removeBranch: (id: string) => { dispatch(Branches.actions.removeBranch(id)); },
  updateBranchWithCommits: (id: string, latestCommitId: string, newCommits: Commit[], parentCommits: string[]) => {
    dispatch(Branches.actions.updateBranchWithCommits(id, latestCommitId, newCommits, parentCommits));
  },
  updateLatestActivityTimestampForBranch: (id: string, timestamp: number) => {
    dispatch(Branches.actions.updateLatestActivityTimestampForBranch(id, timestamp));
  },
  updateLatestDeployedCommitForBranch: (id: string, commit: string) => {
    dispatch(Branches.actions.updateLatestDeployedCommit(id, commit));
  },

  // Comments
  storeComments: (comments: Comment[]) => { dispatch(Comments.actions.storeComments(comments)); },
  removeComment: (comment: string) => { dispatch(Comments.actions.removeComment(comment)); },

  // Commits
  storeCommits: (commits: Commit[]) => { dispatch(Commits.actions.storeCommits(commits)); },
  addDeploymentToCommit: (commitId: string, deploymentId: string) => {
    dispatch(Commits.actions.addDeploymentToCommit(commitId, deploymentId));
  },

  // Deployments
  storeDeployments: (deployments: Deployment[]) => {
    dispatch(Deployments.actions.storeDeployments(deployments));
  },
  addCommentsToDeployment: (id: string, comments: string[]) => {
    dispatch(Deployments.actions.addCommentsToDeployment(id, comments));
  },
  removeCommentFromDeployment: (id: string, comment: string) => {
    dispatch(Deployments.actions.removeCommentFromDeployment(id, comment));
  },

  // Projects
  storeProjects: (projects: Project[]) => { dispatch(Projects.actions.storeProjects(projects)); },
  removeProject: (id: string) => { dispatch(Projects.actions.removeProject(id)); },
  updateProject: (id: string, name: string, repoUrl: string, description?: string) => {
    dispatch(Projects.actions.updateProject(id, name, repoUrl, description));
  },
  storeAuthorsToProject: (id: string, authors: ProjectUser[]) => {
    dispatch(Projects.actions.storeAuthorsToProject(id, authors));
  },
  addBranchToProject: (id: string, branch: string) => {
    dispatch(Projects.actions.addBranchesToProject(id, branch));
  },
  removeBranchFromProject: (id: string, branch: string) => {
    dispatch(Projects.actions.removeBranchFromProject(id, branch));
  },
  updateLatestActivityTimestampForProject: (id: string, timestamp: number) => {
    dispatch(Projects.actions.updateLatestActivityTimestampForProject(id, timestamp));
  },
  updateLatestDeployedCommitForProject: (id: string, commit: string) => {
    dispatch(Projects.actions.updateLatestDeployedCommitForProject(id, commit));
  },

  // Streaming
  setConnectionState: (state: ConnectionState, error?: string) => {
    dispatch(Streaming.actions.setConnectionState(state, error));
  },
});

export default connect<{}, GeneratedDispatchProps, PassedProps>(
  () => ({}),
  mapDispatchToProps,
)(StreamingAPIHandler);
