import { EntityType } from '../modules/previews';

export type ApiResult<T> =
  | { response: T }
  | { error: string; details?: string; unauthorized?: boolean };

export interface Api {
  Activity: {
    fetchAll: (
      teamId: string,
      count: number,
      until?: number,
    ) => Promise<ApiResult<ApiEntityResponse>>;
    fetchAllForProject: (
      id: string,
      count: number,
      until?: number,
    ) => Promise<ApiResult<ApiEntityResponse>>;
  };
  Branch: {
    fetch: (id: string) => Promise<ApiResult<ApiEntityResponse>>;
    fetchForProject: (id: string) => Promise<ApiResult<ApiEntityResponse>>;
  };
  Comment: {
    fetchForDeployment: (id: string) => Promise<ApiResult<ApiEntityResponse>>;
    create: (
      deployment: string,
      message: string,
      email: string,
      name?: string,
    ) => Promise<ApiResult<ApiEntityResponse>>;
    delete: (id: string) => Promise<ApiResult<{}>>;
  };
  Commit: {
    fetch: (id: string) => Promise<ApiResult<ApiEntityResponse>>;
    fetchForBranch: (
      id: string,
      count: number,
      until?: number,
    ) => Promise<ApiResult<ApiEntityResponse>>;
  };
  Deployment: {
    fetch: (id: string) => Promise<ApiResult<ApiEntityResponse>>;
    fetchBuildLog: (id: string) => Promise<ApiResult<string>>;
  };
  Preview: {
    fetch: (
      id: string,
      entityType: EntityType,
      token: string,
    ) => Promise<ApiResult<ApiPreviewResponse>>;
  };
  Project: {
    fetchAll: (teamId: string) => Promise<ApiResult<ApiEntityResponse>>;
    fetch: (id: string) => Promise<ApiResult<ApiEntityResponse>>;
    create: (
      teamId: string,
      name: string,
      description?: string,
      projectTemplate?: string,
    ) => Promise<ApiResult<ApiEntityResponse>>;
    edit: (
      id: string,
      newAttributes: { description?: string; name?: string },
    ) => Promise<ApiResult<ApiEntityResponse>>;
    delete: (id: string) => Promise<ApiResult<{}>>;
  };
  Team: {
    fetch: () => Promise<ApiResult<ApiTeam>>;
  };
  User: {
    signup: () => Promise<ApiResult<SignupResponse>>;
    logout: () => Promise<ApiResult<{}>>;
  };
}

// Response formats
export type ApiEntityTypeString =
  | 'commits'
  | 'deployments'
  | 'projects'
  | 'branches'
  | 'activities'
  | 'comments';

export interface ApiEntity {
  type: ApiEntityTypeString;
  id: string;
  attributes?: any;
  relationships?: any;
}

export interface ApiEntityResponse {
  data: ApiEntity | ApiEntity[];
  included?: ApiEntity[];
}

export interface ApiPreviewResponse {
  project: {
    id: string;
    name: string;
  };
  branch: {
    id: string;
    name: string;
  };
  commit: ResponseCommitElement;
  deployment: ResponseDeploymentElement;
  next?: string;
  previous?: string;
}

export interface ApiUser {
  name?: string;
  email: string;
  timestamp: string;
}

// References
interface ResponseCommitReference {
  type: 'commits';
  id: string;
}

interface ResponseDeploymentReference {
  type: 'deployments';
  id: string;
}

interface ResponseProjectReference {
  type: 'projects';
  id: string;
}

interface ProjectUser {
  email: string;
  name?: string;
}

// Project
export interface ResponseProjectElement {
  type: 'projects';
  id: string;
  attributes: {
    name: string;
    description?: string;
    'active-committers': ProjectUser[];
    'latest-activity-timestamp'?: string;
    'repo-url': string;
    token: string;
  };
  relationships?: {
    'latest-successfully-deployed-commit'?: {
      data?: ResponseCommitReference;
    };
  };
}

// Activity
type ActivityTypeString = 'deployment' | 'comment';

export interface ResponseActivityElement {
  type: 'activities';
  id: string;
  attributes: {
    'activity-type': ActivityTypeString;
    timestamp: string;
    project: {
      id: string;
      name: string;
    };
    branch: {
      id: string;
      name: string;
    };
    commit: {
      id: string;
      hash: string;
      message: string;
      author: {
        name?: string;
        email: string;
        timestamp: string;
      };
      committer: {
        name?: string;
        email: string;
        timestamp: string;
      };
      deployments: string[];
    };
    deployment: {
      status: DeploymentStatusString;
      id: string;
      url?: string;
      screenshot?: string;
      creator: {
        name?: string;
        email: string;
        timestamp: string;
      };
      token: string;
    };
    comment?: {
      // Only for comments
      id: string;
      message: string;
      name?: string;
      email: string;
    };
  };
}

// Branch
export interface ResponseBranchElement {
  type: 'branches';
  id: string;
  attributes: {
    name: string;
    description?: string;
    'latest-activity-timestamp'?: string;
    'minard-json'?: {
      errors?: string[];
    };
    token: string;
  };
  relationships: {
    'latest-successfully-deployed-commit'?: {
      data?: ResponseCommitReference;
    };
    'latest-commit'?: {
      data?: ResponseCommitReference;
    };
    project: {
      data: ResponseProjectReference;
    };
  };
}

// Comment
export interface ResponseCommentElement {
  type: 'comments';
  id: string;
  attributes: {
    email: string;
    name?: string;
    message: string;
    deployment: string;
    'created-at': string;
  };
}

// Commit
export interface ResponseCommitElement {
  type: 'commits';
  id: string;
  attributes: {
    hash: string;
    message: string;
    author: ApiUser;
    committer: ApiUser;
  };
  relationships?: {
    deployments?: {
      data?: ResponseDeploymentReference[];
    };
  };
}

// Deployment
type DeploymentStatusString =
  | 'success'
  | 'failed'
  | 'running'
  | 'pending'
  | 'canceled';

export interface ResponseDeploymentElement {
  type: 'deployments';
  id: string;
  attributes: {
    creator: ApiUser;
    url?: string;
    screenshot?: string;
    'comment-count': number;
    status: DeploymentStatusString;
    token: string;
  };
}

// Team
export interface ApiTeam {
  id: number;
  name: string;
  path: string;
  'invitation-token'?: string;
  description?: string;
  avatar_url?: string;
}

// User
export interface SignupResponse {
  password: string;
  team: ApiTeam;
}
