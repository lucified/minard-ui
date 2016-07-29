import { Action, ActionCreator } from 'redux';

import { createRequestTypes } from '../common';

interface BranchesRequestActionObject {
  request: (branchId: string) => Action;
  success: (branchId: string, response: any) => Action;
  failure: (branchId: string, error: any) => Action;
}

interface LoadBranchesAction extends Action {
  id: string;
}

const BRANCHES = createRequestTypes('BRANCHES');

export const requestActionCreators: BranchesRequestActionObject = {
  request: (id) => ({ type: BRANCHES.REQUEST, id }),
  success: (id, response) => ({ type: BRANCHES.SUCCESS, id, response }),
  failure: (id, error) => ({ type: BRANCHES.FAILURE, id, error }),
};

export const LOAD_BRANCHES_FOR_PROJECT = 'BRANCHES/LOAD_BRANCHES_FOR_PROJECT';
export const loadBranchesForProject: ActionCreator<LoadBranchesAction> = (id) => ({
  type: LOAD_BRANCHES_FOR_PROJECT,
  id,
});
