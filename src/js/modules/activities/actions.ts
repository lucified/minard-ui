import { Action, ActionCreator } from 'redux';

import { createRequestTypes, prettyErrorMessage } from '../common';

interface ActivityRequestActionObject {
  request: (branchId: string) => Action;
  success: (branchId: string, response: any) => Action;
  failure: (branchId: string, error: any) => Action;
}

interface LoadActivityAction extends Action {
  id: string;
}

export const ACTIVITY = createRequestTypes('ACTIVITY');
export const requestActionCreators: ActivityRequestActionObject = {
  request: (id) => ({ type: ACTIVITY.REQUEST, id }),
  success: (id, response) => ({ type: ACTIVITY.SUCCESS, id, response }),
  failure: (id, error) => ({ type: ACTIVITY.FAILURE, id, error, prettyError: prettyErrorMessage(error) }),
};

export const LOAD_ACTIVITY = 'ACTIVITY/LOAD_ACTIVITY';
export const loadActivity: ActionCreator<LoadActivityAction> = (id) => ({
  type: LOAD_ACTIVITY,
  id,
});
