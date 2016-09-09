import { createRequestTypes, prettyErrorMessage } from '../common';
import * as t from './types';

export const LOAD_BRANCH = 'BRANCHES/LOAD_BRANCH';
export const loadBranch = (id: string): t.LoadBranchAction => ({
  type: LOAD_BRANCH,
  id,
});

export const BRANCH = createRequestTypes('BRANCHES/BRANCH');
export const FetchBranch: t.RequestBranchActionCreators = {
  request: (id) => ({ type: BRANCH.REQUEST, id }),
  success: (id, response) => ({ type: BRANCH.SUCCESS, id, response }),
  failure: (id, error, details) => ({
    type: BRANCH.FAILURE,
    id,
    error,
    details,
    prettyError: prettyErrorMessage(error),
  }),
};

export const LOAD_BRANCHES_FOR_PROJECT = 'BRANCHES/LOAD_BRANCHES_FOR_PROJECT';
export const loadBranchesForProject = (id: string): t.LoadBranchesForProjectAction => ({
  type: LOAD_BRANCHES_FOR_PROJECT,
  id,
});

export const BRANCHES_FOR_PROJECT = createRequestTypes('BRANCHES/BRANCHES_FOR_PROJECT');
export const FetchBranchesForProject: t.RequestBranchesForProjectActionCreators = {
  request: (id) => ({ type: BRANCHES_FOR_PROJECT.REQUEST, id }),
  success: (id, response) => ({ type: BRANCHES_FOR_PROJECT.SUCCESS, id, response }),
  failure: (id, error, details) => ({
    type: BRANCHES_FOR_PROJECT.FAILURE,
    id,
    error,
    details,
    prettyError: prettyErrorMessage(error),
  }),
};

// Add commits to existing branch
export const ADD_COMMITS_TO_BRANCH = 'BRANCHES/ADD_COMMITS_TO_BRANCH';
export const addCommitsToBranch = (id: string, commitIds: string[]): t.AddCommitsToBranchAction => ({
  type: ADD_COMMITS_TO_BRANCH,
  id,
  commits: commitIds,
});

export const STORE_BRANCHES = 'BRANCHES/STORE_BRANCHES';
export const storeBranches = (branches: t.ResponseBranchElement[]): t.StoreBranchesAction => ({
  type: STORE_BRANCHES,
  entities: branches,
});
