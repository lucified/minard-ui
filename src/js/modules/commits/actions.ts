import { Action, ActionCreator } from 'redux';

import { createRequestTypes } from '../common';

interface CommitsRequestActionObject {
  request: (branchId: string) => Action;
  success: (branchId: string, response: any) => Action;
  failure: (branchId: string, error: any) => Action;
}

interface LoadCommitsAction extends Action {
  id: string;
}

const COMMITS = createRequestTypes('COMMITS');

export const requestActionCreators: CommitsRequestActionObject = {
  request: (id) => ({ type: COMMITS.REQUEST, id }),
  success: (id, response) => ({ type: COMMITS.SUCCESS, id, response }),
  failure: (id, error) => ({ type: COMMITS.FAILURE, id, error }),
};

export const LOAD_COMMITS_FOR_BRANCH = 'COMMITS/LOAD_COMMITS_FOR_BRANCH';
export const loadCommitsForBranch: ActionCreator<LoadCommitsAction> = (id) => ({
  type: LOAD_COMMITS_FOR_BRANCH,
  id,
});
