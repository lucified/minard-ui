import { Action, ActionCreator } from 'redux';

// State
export interface Commit {
  hash: string;
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
export interface RequestCommitAction extends Action {
  id: string;
  error?: any;
  response?: ResponseCommitElement;
}

export interface RequestCommitActionCreators {
  request: ActionCreator<RequestCommitAction>;
  success: ActionCreator<RequestCommitAction>;
  failure: ActionCreator<RequestCommitAction>;
}

export interface StoreCommitsAction extends Action {
  commits: ResponseCommitElement[];
}

// API response
interface ResponseDeploymentReference {
  type: "deployments";
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
    deployments: {
      data: ResponseDeploymentReference[];
    };
  };
}

export type ApiResponse = ResponseCommitElement[];
