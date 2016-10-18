import * as t from './types';

import { Commit } from '../commits';

export const LOAD_BRANCH = 'BRANCHES/LOAD_BRANCH';
export const loadBranch = (id: string): t.LoadBranchAction => ({
  type: LOAD_BRANCH,
  id,
});

export const LOAD_BRANCHES_FOR_PROJECT = 'BRANCHES/LOAD_BRANCHES_FOR_PROJECT';
export const loadBranchesForProject = (id: string): t.LoadBranchesForProjectAction => ({
  type: LOAD_BRANCHES_FOR_PROJECT,
  id,
});

// Add commits to existing branch
export const REPLACE_COMMITS_IN_BRANCH = 'BRANCHES/REPLACE_COMMITS_IN_BRANCH';
export const replaceCommitsInBranch = (
  id: string,
  commitIds: string[],
  allCommitsLoaded: boolean
): t.ReplaceCommitsInBranchAction => ({
  type: REPLACE_COMMITS_IN_BRANCH,
  id,
  commits: commitIds,
  allCommitsLoaded,
});

export const STORE_BRANCHES = 'BRANCHES/STORE_BRANCHES';
export const storeBranches = (branches: t.Branch[]): t.StoreBranchesAction => ({
  type: STORE_BRANCHES,
  entities: branches,
});

export const REMOVE_BRANCH = 'BRANCHES/REMOVE_BRANCH';
export const removeBranch = (id: string): t.RemoveBranchAction => ({
  type: REMOVE_BRANCH,
  id,
});

// This action is used when a push event is received from the Streaming API.
// Because it might be a force push, we might need to
export const STORE_COMMITS_TO_BRANCH = 'BRANCHES/STORE_COMMITS_TO_BRANCH';
export const storeCommitsToBranch = (
  id: string,
  commits: Commit[],
  parentCommits: string[]
): t.StoreCommitsToBranchAction => ({
  type: STORE_COMMITS_TO_BRANCH,
  id,
  commits,
  parentCommits,
});

export const UPDATE_LATEST_DEPLOYED_COMMIT_FOR_BRANCH = 'BRANCHES/UPDATE_LATEST_DEPLOYED_COMMIT_FOR_BRANCH';
export const updateLatestDeployedCommit = (id: string, commit: string): t.UpdateLatestDeployedCommitAction => ({
  type: UPDATE_LATEST_DEPLOYED_COMMIT_FOR_BRANCH,
  id,
  commit,
});

export const UPDATE_LATEST_ACTIVITY_TIMESTAMP_FOR_BRANCH = 'BRANCHES/UPDATE_LATEST_ACTIVITY_TIMESTAMP_FOR_BRANCH';
export const updateLatestActivityTimestampForBranch = (
  id: string,
  timestamp: number,
): t.UpdateLatestActivityTimestampAction => ({
  type: UPDATE_LATEST_ACTIVITY_TIMESTAMP_FOR_BRANCH,
  id,
  timestamp,
});
