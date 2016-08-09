import { ActionCreator } from 'redux';

import Activities from '../activities';
import Projects from '../projects';

import * as t from './types';

export const CLEAR_FETCH_ALL_PROJECTS_ERRORS = 'ERRORS/CLEAR_FETCH_ALL_PROJECTS_ERRORS';
export const CLEAR_ACTIVITIES_ERRORS = 'ERRORS/CLEAR_ACTIVITIES_ERRORS';
export const CLEAR_ERROR = 'ERRORS/CLEAR_ERROR'; // Not currently used

export const clearError: ActionCreator<t.ClearErrorAction> = (error: t.FetchError) => {
  switch (error.type) {
    case Projects.actions.ALL_PROJECTS.FAILURE:
      return {
        type: CLEAR_FETCH_ALL_PROJECTS_ERRORS,
      };
    case Activities.actions.ACTIVITIES.FAILURE:
      return {
        type: CLEAR_ACTIVITIES_ERRORS,
      };
    default:
      // TODO: clear different types of errors?
      return {
        type: CLEAR_ERROR,
        id: error.id,
      };
  }
};
