import { ActionCreator } from 'redux';

import { createRequestTypes } from '../common';
import * as t from './types';

export const BRANCH = createRequestTypes('BRANCHES/BRANCH');
export const FetchBranch: t.BranchesRequestActionCreators = {
  request: (id) => ({ type: BRANCH.REQUEST, id }),
  success: (id, response) => ({ type: BRANCH.SUCCESS, id, response }),
  failure: (id, error) => ({ type: BRANCH.FAILURE, id, error }),
};

export const LOAD_BRANCH = 'BRANCHES/LOAD_BRANCH';
export const loadBranch: ActionCreator<t.LoadBranchAction> = (id) => ({
  type: LOAD_BRANCH,
  id,
});

export const STORE_BRANCHES = 'BRANCHES/STORE_BRANCHES';
export const StoreBranches: ActionCreator<t.StoreBranchesAction> = (branches) => ({
  type: STORE_BRANCHES,
  branches,
});
