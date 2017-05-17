import { Commit } from '../commits';
import { FetchError } from '../errors';

// State
export interface Branch {
  id: string;
  name: string;
  project: string;
  description?: string;
  // In chronological order. The first commit is the newest one.
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
export interface LoadBranchAction {
  type: 'BRANCHES/LOAD_BRANCH';
  id: string;
}

export interface FetchBranchAction {
  type: 'BRANCHES/FETCH_BRANCH';
  id: string;
}

export interface LoadBranchesForProjectAction {
  type: 'BRANCHES/LOAD_BRANCHES_FOR_PROJECT';
  id: string;
}

export interface AddCommitsToBranchAction {
  type: 'BRANCHES/ADD_COMMITS_TO_BRANCH';
  id: string;
  commits: string[];
  requestedCount: number;
}

export interface StoreBranchesAction {
  type: 'BRANCHES/STORE_BRANCHES';
  entities: Branch[];
}

export interface RemoveBranchAction {
  type: 'BRANCHES/REMOVE_BRANCH';
  id: string;
}

export interface UpdateBranchWithCommitsAction {
  type: 'BRANCHES/UPDATE_BRANCH_WITH_COMMITS';
  id: string;
  latestCommitId: string;
  newCommits: Commit[];
  parentCommitIds: string[];
}

export interface UpdateLatestDeployedCommitAction {
  type: 'BRANCHES/UPDATE_LATEST_DEPLOYED_COMMIT_FOR_BRANCH';
  id: string;
  commit: string;
}

export interface UpdateLatestActivityTimestampAction {
  type: 'BRANCHES/UPDATE_LATEST_ACTIVITY_TIMESTAMP_FOR_BRANCH';
  id: string;
  timestamp: number;
}
