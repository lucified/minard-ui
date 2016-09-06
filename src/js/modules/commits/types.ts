import { Action } from 'redux';

import { FetchError } from '../errors';
import { ApiUser, RequestActionCreators, User } from '../types';

// State
export interface Commit {
  id: string;
  hash: string;
  message: string;
  description?: string;
  author: User;
  committer: User;
  deployment?: string;
}

export interface CommitState {
  [id: string]: Commit | FetchError;
};

// Actions
// LOAD_COMMIT
export interface LoadCommitAction extends Action {
  id: string;
}

// COMMIT
export interface RequestCommitRequestAction extends Action {
  id: string;
}

export interface RequestCommitSuccessAction extends Action {
  id: string;
  response: ResponseCommitElement;
}

export type RequestCommitActionCreators =
  RequestActionCreators<RequestCommitRequestAction, RequestCommitSuccessAction, FetchError>;

// STORE_COMMITS
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
    message: string;
    author: ApiUser;
    committer: ApiUser;
  };
  relationships?: {
    deployments?: {
      data: ResponseDeploymentReference[];
    };
  };
}

export type ApiResponse = ResponseCommitElement[];
