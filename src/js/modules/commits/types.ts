import { Action, ActionCreator } from 'redux';

import { FetchError } from '../errors';

// State
export interface Commit {
  id: string;
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
  [id: string]: Commit | FetchError;
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
  entities: ResponseCommitElement[];
}

// API response
interface ResponseDeploymentReference {
  type: "deployments";
  id: string;
}

export interface ResponseCommitElement {
  type: "commits";
  id: string;
  attributes: {
    hash: string;
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
