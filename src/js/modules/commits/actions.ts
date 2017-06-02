import {
  AddDeploymentToCommitAction,
  Commit,
  FetchCommitAction,
  LoadCommitAction,
  LoadCommitsForBranchAction,
  StoreCommitsAction,
} from './types';

export const LOAD_COMMIT = 'COMMITS/LOAD_COMMIT';
export const loadCommit = (id: string): LoadCommitAction => ({
  type: LOAD_COMMIT,
  id,
});

export const FETCH_COMMIT = 'COMMITS/FETCH_COMMIT';
export const fetchCommit = (id: string): FetchCommitAction => ({
  type: FETCH_COMMIT,
  id,
});

export const LOAD_COMMITS_FOR_BRANCH = 'COMMITS/LOAD_COMMITS_FOR_BRANCH';
export const loadCommitsForBranch = (
  id: string,
  count: number,
  until?: number,
): LoadCommitsForBranchAction => ({
  type: LOAD_COMMITS_FOR_BRANCH,
  id,
  count,
  until,
});

export const STORE_COMMITS = 'COMMITS/STORE_COMMITS';
export const storeCommits = (commits: Commit[]): StoreCommitsAction => ({
  type: STORE_COMMITS,
  entities: commits,
});

export const ADD_DEPLOYMENT_TO_COMMIT = 'COMMITS/ADD_DEPLOYMENT_TO_COMMIT';
export const addDeploymentToCommit = (
  id: string,
  deployment: string,
): AddDeploymentToCommitAction => ({
  type: ADD_DEPLOYMENT_TO_COMMIT,
  id,
  deployment,
});
