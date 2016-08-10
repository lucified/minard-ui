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
export const loadActivities: ActionCreator<t.LoadActivitiesAction> = () => ({
  type: LOAD_ACTIVITIES,
});

export const ACTIVITIES_FOR_PROJECT = createRequestTypes('ACTIVITIES/ACTIVITIES_FOR_PROJECT');
export const FetchActivitiesForProject: t.RequestActivitiesActionCreators = {
  request: (id) => ({ type: ACTIVITIES_FOR_PROJECT.REQUEST, id }),
  success: (id, response) => ({ type: ACTIVITIES_FOR_PROJECT.SUCCESS, id, response }),
  failure: (id, error) => ({
    type: ACTIVITIES_FOR_PROJECT.FAILURE,
    id,
    error,
    prettyError: prettyErrorMessage(error),
  }),
};

export const LOAD_ACTIVITIES_FOR_PROJECT = 'ACTIVITIES/LOAD_ACTIVITIES_FOR_PROJECT';
export const loadActivitiesForProject: ActionCreator<t.LoadActivitiesForProjectAction> = (id: string) => ({
  type: LOAD_ACTIVITIES_FOR_PROJECT,
  id,
});

export const STORE_ACTIVITIES = 'ACTIVITIES/STORE_ACTIVITIES';
export const storeActivities: ActionCreator<t.StoreActivitiesAction> = (activities) => ({
  type: STORE_ACTIVITIES,
  entities: activities,
});
