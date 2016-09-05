import { ActionCreator } from 'redux';

import { createRequestTypes, prettyErrorMessage } from '../common';
import * as t from './types';

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

export const LOAD_BRANCH = 'BRANCHES/LOAD_BRANCH';
export const loadBranch: ActionCreator<t.LoadBranchAction> = (id) => ({
  type: LOAD_BRANCH,
  id,
});

export const STORE_BRANCHES = 'BRANCHES/STORE_BRANCHES';
export const storeBranches: ActionCreator<t.StoreBranchesAction> = (branches) => ({
  type: STORE_BRANCHES,
  entities: branches,
});
