import {
  AddCommitsToBranchAction,
  Branch,
  FetchBranchAction,
  LoadBranchAction,
  LoadBranchesForProjectAction,
  RemoveBranchAction,
  StoreBranchesAction,
  UpdateBranchWithCommitsAction,
  UpdateLatestActivityTimestampAction,
  UpdateLatestDeployedCommitAction,
} from './types';

import { Commit } from '../commits';

export const LOAD_BRANCH = 'BRANCHES/LOAD_BRANCH';
export const loadBranch = (id: string): LoadBranchAction => ({
  type: LOAD_BRANCH,
  id,
});

export const FETCH_BRANCH = 'BRANCHES/FETCH_BRANCH';
export const fetchBranch = (id: string): FetchBranchAction => ({
  type: FETCH_BRANCH,
  id,
});

export const LOAD_BRANCHES_FOR_PROJECT = 'BRANCHES/LOAD_BRANCHES_FOR_PROJECT';
export const loadBranchesForProject = (id: string): LoadBranchesForProjectAction => ({
  type: LOAD_BRANCHES_FOR_PROJECT,
  id,
});

// Add commits to existing branch
export const ADD_COMMITS_TO_BRANCH = 'BRANCHES/ADD_COMMITS_TO_BRANCH';
export const addCommitsToBranch = (
  id: string,
  commitIds: string[],
  requestedCount: number,
): AddCommitsToBranchAction => ({
  type: ADD_COMMITS_TO_BRANCH,
  id,
  commits: commitIds,
  requestedCount,
});

export const STORE_BRANCHES = 'BRANCHES/STORE_BRANCHES';
export const storeBranches = (branches: Branch[]): StoreBranchesAction => ({
  type: STORE_BRANCHES,
  entities: branches,
});

export const REMOVE_BRANCH = 'BRANCHES/REMOVE_BRANCH';
export const removeBranch = (id: string): RemoveBranchAction => ({
  type: REMOVE_BRANCH,
  id,
});

// This action is used when a push event is received from the Streaming API.
// Because it might be a force push, we might need to reset the commit back
// to a previous commit or replace some existing commits with new ones.
export const UPDATE_BRANCH_WITH_COMMITS = 'BRANCHES/UPDATE_BRANCH_WITH_COMMITS';
export const updateBranchWithCommits = (
  id: string,
  latestCommitId: string,
  newCommits: Commit[],
  parentCommitIds: string[],
): UpdateBranchWithCommitsAction => ({
  type: UPDATE_BRANCH_WITH_COMMITS,
  id,
  latestCommitId,
  newCommits,
  parentCommitIds,
});

export const UPDATE_LATEST_DEPLOYED_COMMIT_FOR_BRANCH = 'BRANCHES/UPDATE_LATEST_DEPLOYED_COMMIT_FOR_BRANCH';
export const updateLatestDeployedCommit = (id: string, commit: string): UpdateLatestDeployedCommitAction => ({
  type: UPDATE_LATEST_DEPLOYED_COMMIT_FOR_BRANCH,
  id,
  commit,
});

export const UPDATE_LATEST_ACTIVITY_TIMESTAMP_FOR_BRANCH = 'BRANCHES/UPDATE_LATEST_ACTIVITY_TIMESTAMP_FOR_BRANCH';
export const updateLatestActivityTimestampForBranch = (
  id: string,
  timestamp: number,
): UpdateLatestActivityTimestampAction => ({
  type: UPDATE_LATEST_ACTIVITY_TIMESTAMP_FOR_BRANCH,
  id,
  timestamp,
});
