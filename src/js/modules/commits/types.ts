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
export interface LoadCommitAction {
  type: 'COMMITS/LOAD_COMMIT';
  id: string;
}

export interface FetchCommitAction {
  type: 'COMMITS/FETCH_COMMIT';
  id: string;
}

export interface LoadCommitsForBranchAction {
  type: 'COMMITS/LOAD_COMMITS_FOR_BRANCH';
  id: string;
  count: number;
  until?: number;
}

export interface StoreCommitsAction {
  type: 'COMMITS/STORE_COMMITS';
  entities: Commit[];
}

export interface AddDeploymentToCommitAction {
  type: 'COMMITS/ADD_DEPLOYMENT_TO_COMMIT';
  id: string;
  deployment: string;
}
