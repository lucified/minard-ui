import { Action } from 'redux';

import { Commit } from '../commits';
import { FetchError } from '../errors';

// State
export interface Branch {
  id: string;
  name: string;
  project: string;
  description?: string;
  commits: string[];
  allCommitsLoaded: boolean;
  latestSuccessfullyDeployedCommit?: string;
  latestCommit?: string;
  latestActivityTimestamp?: number;
  buildErrors: string[];
  token: string;
}

export interface BranchState {
  [id: string]: Branch | FetchError;
}

// Actions
// LOAD_BRANCH
export interface LoadBranchAction extends Action {
  id: string;
}

// LOAD_BRANCHES_FOR_PROJECT
export interface LoadBranchesForProjectAction extends Action {
  id: string;
}

// ADD_COMMITS_TO_BRANCH
export interface AddCommitsToBranchAction extends Action {
  id: string;
  commits: string[];
  requestedCount: number;
}

// STORE_BRANCHES
export interface StoreBranchesAction extends Action {
  entities: Branch[];
}

// REMOVE_BRANCH
export interface RemoveBranchAction extends Action {
  id: string;
}

// UPDATE_BRANCH_WITH_COMMITS
export interface UpdateBranchWithCommitsAction extends Action {
  id: string;
  latestCommitId: string;
  newCommits: Commit[];
  parentCommitIds: string[];
}

// UPDATE_LATEST_DEPLOYED_COMMIT_FOR_BRANCH
export interface UpdateLatestDeployedCommitAction extends Action {
  id: string;
  commit: string;
}

// UPDATE_LATEST_ACTIVITY_TIMESTAMP_FOR_BRANCH
export interface UpdateLatestActivityTimestampAction extends Action {
  id: string;
  timestamp: number;
}
