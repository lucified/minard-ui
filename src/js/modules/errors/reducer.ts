import { Reducer } from 'redux';

import Requests from '../requests';

import { CLEAR_STORED_DATA } from '../user';
import { CLEAR_PROJECT_DELETION_ERRORS, CLEAR_SIGNUP_ERROR, SIGNUP_ERROR } from './actions';
import { ErrorState, MinardError } from './types';

const initialState: ErrorState = [];

const returnFilteredStateIfChanged = (state: ErrorState, predicate: (error: MinardError) => boolean): ErrorState => {
  const filteredState = state.filter(predicate);
  return filteredState.length !== state.length ? filteredState : state;
};

const reducer: Reducer<ErrorState> = (state = initialState, action: any) => {
  switch (action.type) {
    case Requests.actions.Projects.LoadAllProjects.FAILURE.type:
    case Requests.actions.Activities.LoadAllActivities.FAILURE.type:
    case Requests.actions.Projects.DeleteProject.FAILURE.type:
    case SIGNUP_ERROR:
      return state.concat(action);
    case Requests.actions.Projects.LoadAllProjects.REQUEST.type:
      return returnFilteredStateIfChanged(
        state,
        error => error.type !== Requests.actions.Projects.LoadAllProjects.FAILURE.type,
      );
    case Requests.actions.Activities.LoadAllActivities.REQUEST.type:
      return returnFilteredStateIfChanged(
        state,
        error => error.type !== Requests.actions.Activities.LoadAllActivities.FAILURE.type,
      );
    case Requests.actions.Projects.DeleteProject.REQUEST.type:
      return returnFilteredStateIfChanged(
        state,
        error => error.type !== Requests.actions.Projects.DeleteProject.FAILURE.type ||
          (error as any).id !== action.id,
      );
    case CLEAR_PROJECT_DELETION_ERRORS:
      return returnFilteredStateIfChanged(
        state,
        error => error.type !== Requests.actions.Projects.DeleteProject.FAILURE.type,
      );
    case CLEAR_SIGNUP_ERROR:
      return returnFilteredStateIfChanged(
        state,
        error => error.type !== SIGNUP_ERROR,
      );
    case CLEAR_STORED_DATA:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
