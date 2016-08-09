import { ActionCreator } from 'redux';

import { createRequestTypes, prettyErrorMessage } from '../common';
import * as t from './types';

export const ACTIVITIES = createRequestTypes('ACTIVITIES/ACTIVITIES');
export const FetchActivities: t.RequestActivitiesActionCreators = {
  request: () => ({ type: ACTIVITIES.REQUEST }),
  success: (response) => ({ type: ACTIVITIES.SUCCESS, response }),
  failure: (error) => ({
    type: ACTIVITIES.FAILURE,
    id: null,
    error,
    prettyError: prettyErrorMessage(error),
  }),
};

export const LOAD_ACTIVITIES = 'ACTIVITIES/LOAD_ACTIVITIES';
export const loadActivity: ActionCreator<t.LoadActivitiesAction> = () => ({
  type: LOAD_ACTIVITIES,
});

export const STORE_ACTIVITIES = 'ACTIVITIES/STORE_ACTIVITIES';
export const storeActivities: ActionCreator<t.StoreActivitiesAction> = (activities) => ({
  type: STORE_ACTIVITIES,
  entities: activities,
});
