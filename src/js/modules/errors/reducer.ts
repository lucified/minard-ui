import { Reducer } from 'redux';

import Requests from '../requests';

import { CLEAR_PROJECT_DELETION_ERRORS } from './actions';
import * as t from './types';

const initialState: t.ErrorState = [];

const returnFilteredStateIfChanged = (state: t.ErrorState, predicate: (error: t.Error) => boolean): t.ErrorState => {
  const filteredState = state.filter(predicate);
  return filteredState.length !== state.length ? filteredState : state;
};

const reducer: Reducer<t.ErrorState> = (state = initialState, action: any) => {
  switch (action.type) {
    case Requests.actions.Projects.LoadAllProjects.REQUEST.type:
      return returnFilteredStateIfChanged(state, error =>
        error.type !== Requests.actions.Projects.LoadAllProjects.FAILURE.type
      );
    case Requests.actions.Activities.LoadAllActivities.REQUEST.type:
      return returnFilteredStateIfChanged(state, error =>
        error.type !== Requests.actions.Activities.LoadAllActivities.FAILURE.type
      );
    case Requests.actions.Projects.LoadAllProjects.FAILURE.type:
    case Requests.actions.Activities.LoadAllActivities.FAILURE.type:
      return state.concat(action);
    case Requests.actions.Projects.DeleteProject.REQUEST.type:
      return returnFilteredStateIfChanged(state, error =>
        !(error.type === Requests.actions.Projects.DeleteProject.FAILURE.type && (<any> error).id === action.id)
      );
    case Requests.actions.Projects.DeleteProject.FAILURE.type:
      return state.concat(action);
    case CLEAR_PROJECT_DELETION_ERRORS:
      return returnFilteredStateIfChanged(state, error =>
        error.type !== Requests.actions.Projects.DeleteProject.FAILURE.type
      );
    default:
      return state;
  }
};

export default reducer;
