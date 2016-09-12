import * as t from './types';

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
export const ADD_COMMITS_TO_BRANCH = 'BRANCHES/ADD_COMMITS_TO_BRANCH';
export const addCommitsToBranch = (
  id: string,
  commitIds: string[],
  requestedCount: number
): t.AddCommitsToBranchAction => ({
  type: ADD_COMMITS_TO_BRANCH,
  id,
  commits: commitIds,
  requestedCount,
});

export const STORE_BRANCHES = 'BRANCHES/STORE_BRANCHES';
export const storeBranches = (branches: t.Branch[]): t.StoreBranchesAction => ({
  type: STORE_BRANCHES,
  entities: branches,
});
