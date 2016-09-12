import { Action } from 'redux';

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
}

export interface BranchState {
  [id: string]: Branch | FetchError;
};

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
