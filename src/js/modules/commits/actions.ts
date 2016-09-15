import * as t from './types';

export const LOAD_COMMIT = 'COMMITS/LOAD_COMMIT';
export const loadCOMMIT = (id: string): t.LoadCommitAction => ({
  type: LOAD_COMMIT,
  id,
});

export const LOAD_COMMITS_FOR_BRANCH = 'COMMITS/LOAD_COMMITS_FOR_BRANCH';
export const loadCommitsForBranch = (id: string, count: number, until?: number): t.LoadCommitsForBranchAction => ({
  type: LOAD_COMMITS_FOR_BRANCH,
  id,
  count,
  until,
});

export const STORE_COMMITS = 'COMMITS/STORE_COMMITS';
export const storeCommits = (commits: t.Commit[]): t.StoreCommitsAction => ({
  type: STORE_COMMITS,
  entities: commits,
});

export const ADD_DEPLOYMENT_TO_COMMIT = 'COMMITS/ADD_DEPLOYMENT_TO_COMMIT';
export const addDeploymentToCommit = (id: string, deployment: string): t.AddDeploymentToCommitAction => ({
  type: ADD_DEPLOYMENT_TO_COMMIT,
  id,
  deployment,
});
