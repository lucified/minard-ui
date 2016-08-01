import { ActionCreator } from 'redux';

import { createRequestTypes } from '../common';
import * as t from './types';

export const BRANCH = createRequestTypes('BRANCHES/BRANCH');
export const FetchBranch: t.BranchesRequestActionCreators = {
  request: (id, projectId) => ({ type: BRANCH.REQUEST, id, projectId }),
  success: (id, projectId, response) => ({ type: BRANCH.SUCCESS, id, projectId, response }),
  failure: (id, projectId, error) => ({ type: BRANCH.FAILURE, id, projectId, error }),
};

export const LOAD_BRANCH = 'BRANCHES/LOAD_BRANCH';
export const loadBranch: ActionCreator<t.LoadBranchAction> = (id, projectId) => ({
  type: LOAD_BRANCH,
  id,
  projectId,
});

export const STORE_BRANCHES = 'BRANCHES/STORE_BRANCHES';
export const StoreBranches: ActionCreator<t.StoreBranchesAction> = (branches) => ({
  type: STORE_BRANCHES,
  branches,
});
