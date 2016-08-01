import { Action } from 'redux';

// State
export interface Commit {
  hash: string;
  branch: string;
  message: string;
  description?: string;
  author: {
    name?: string;
    email: string;
    timestamp: number;
  };
  commiter: {
    name?: string;
    email: string;
    timestamp: number;
  };
  deployment?: string;
}

export interface CommitState {
  [id: string]: Commit;
};

// Actions
export interface StoreCommitsAction extends Action {
  commits: ResponseCommitElement[];
}

// API response
interface ResponseDeploymentReference {
  type: "deployments";
  id: string;
}

interface ResponseBranchReference {
  type: "branches";
  id: string;
}

interface ResponseCommitElement {
  type: "commits";
  id: string;
  attributes: {
    message?: string;
    author: {
      name?: string;
      email: string;
      timestamp: string;
    };
    commiter: {
      name?: string;
      email: string;
      timestamp: string;
    };
  };
  relationships: {
    branch: {
      data: ResponseBranchReference;
    };
    deployments: {
      data: ResponseDeploymentReference[];
    };
  };
}

export type ApiResponse = ResponseCommitElement[];
