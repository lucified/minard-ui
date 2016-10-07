export type ApiPromise = Promise<{ response: ApiResponse; } | { error: string; details?: string; }>;

export interface Api {
  Project: {
    fetchAll: () => ApiPromise;
    fetch: (id: string) => ApiPromise;
    create: (name: string, description?: string, projectTemplate?: string) => ApiPromise;
    edit: (id: string, newAttributes: { description?: string, name?: string }) => ApiPromise;
    delete: (id: string) => ApiPromise;
  };
  Activity: {
    fetchAll: (count: number, until?: number) => ApiPromise;
    fetchAllForProject: (id: string, count: number, until?: number) => ApiPromise;
  };
  Deployment: {
    fetch: (id: string) => ApiPromise;
  };
  Branch: {
    fetch: (id: string) => ApiPromise;
    fetchForProject: (id: string) => ApiPromise;
  };
  Commit: {
    fetch: (id: string) => ApiPromise;
    fetchForBranch: (id: string, count: number, until?: number) => ApiPromise;
  };
}

// Response formats
export type ApiEntityTypeString = 'commits' | 'deployments' | 'projects' | 'branches' | 'activities';

export interface ApiEntity {
  type: ApiEntityTypeString;
  id: string;
  attributes?: any;
  relationships?: any;
}

export interface ApiResponse {
  data: ApiEntity | ApiEntity[];
  included?: ApiEntity[];
}

export interface ApiUser {
  name?: string;
  email: string;
  timestamp: string;
}

// References
interface ResponseBranchReference {
  type: 'branches';
  id: string;
}

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
    status: DeploymentStatusString;
  };
}
