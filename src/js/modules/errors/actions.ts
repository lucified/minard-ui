import { ActionCreator } from 'redux';

import Projects from '../projects';

import * as t from './types';

export const CLEAR_FETCH_ALL_PROJECTS_ERRORS = 'ERRORS/CLEAR_FETCH_ALL_PROJECTS_ERRORS';
export const CLEAR_ERROR = 'ERRORS/CLEAR_ERROR'; // Not currently used

export const clearError: ActionCreator<t.ClearErrorAction> = (error: t.FetchError) => {
  if (error.type === Projects.actions.ALL_PROJECTS.FAILURE) {
    return {
      type: CLEAR_FETCH_ALL_PROJECTS_ERRORS,
    };
  }

  // TODO: clear different types of errors?
  return {
    type: CLEAR_ERROR,
    id: error.id,
  };
};
