import { Action } from 'redux';

import { FetchError } from '../errors';
import { ApiUser, RequestFetchActionCreators, User } from '../types';

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
export type RequestCommitActionCreators = RequestFetchActionCreators<ResponseCommitElement>;

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
