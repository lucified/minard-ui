export type ApiPromise<T> = Promise<{ response: T; } | { error: string; details?: string; }>;

export interface Api {
  Activity: {
    fetchAll: (count: number, until?: number) => ApiPromise<ApiEntityResponse>;
    fetchAllForProject: (id: string, count: number, until?: number) => ApiPromise<ApiEntityResponse>;
  };
  Branch: {
    fetch: (id: string) => ApiPromise<ApiEntityResponse>;
    fetchForProject: (id: string) => ApiPromise<ApiEntityResponse>;
  };
  Comment: {
    fetchForDeployment: (id: string) => ApiPromise<ApiEntityResponse>;
    create: (deployment: string, message: string, email: string, name?: string) => ApiPromise<ApiEntityResponse>;
    delete: (id: string) => ApiPromise<{}>;
  };
  Commit: {
    fetch: (id: string) => ApiPromise<ApiEntityResponse>;
    fetchForBranch: (id: string, count: number, until?: number) => ApiPromise<ApiEntityResponse>;
  };
  Deployment: {
    fetch: (id: string) => ApiPromise<ApiEntityResponse>;
  };
  Preview: {
    fetch: (id: string, commitHash: string) => ApiPromise<ApiPreviewResponse>;
  };
  Project: {
    fetchAll: () => ApiPromise<ApiEntityResponse>;
    fetch: (id: string) => ApiPromise<ApiEntityResponse>;
    create: (name: string, description?: string, projectTemplate?: string) => ApiPromise<ApiEntityResponse>;
    edit: (id: string, newAttributes: { description?: string, name?: string }) => ApiPromise<ApiEntityResponse>;
    delete: (id: string) => ApiPromise<{}>;
  };
}

// Response formats
export type ApiEntityTypeString = 'commits' | 'deployments' | 'projects' | 'branches' | 'activities' | 'comments';

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
    };
    comment?: { // Only for comments
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
    }
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
type DeploymentStatusString = 'success' | 'failed' | 'running' | 'pending' | 'canceled';

export interface ResponseDeploymentElement {
  type: 'deployments';
  id: string;
  attributes: {
    creator: ApiUser;
    url?: string;
    screenshot?: string;
    'comment-count': number;
    status: DeploymentStatusString;
  };
}
