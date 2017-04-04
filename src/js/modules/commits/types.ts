import { Action } from 'redux';

import { FetchError } from '../errors';
import { User } from '../types';

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
}

// Actions
// LOAD_COMMIT
export interface LoadCommitAction extends Action {
  id: string;
}

// LOAD_COMMITS_FOR_BRANCH
export interface LoadCommitsForBranchAction extends Action {
  id: string;
  count: number;
  until?: number;
}

// STORE_COMMITS
export interface StoreCommitsAction extends Action {
  entities: Commit[];
}

export interface AddDeploymentToCommitAction extends Action {
  id: string;
  deployment: string;
}
