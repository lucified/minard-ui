import { Reducer } from 'redux';

import Activities from '../activities';
import Projects from '../projects';

import { CLEAR_PROJECT_DELETION_ERRORS } from './actions';
import * as t from './types';

const initialState: t.ErrorState = [];

const reducer: Reducer<t.ErrorState> = (state = initialState, action: any) => {
  switch (action.type) {
    case Projects.actions.ALL_PROJECTS.REQUEST:
      return state.filter(error => error.type !== Projects.actions.ALL_PROJECTS.FAILURE);
    case Activities.actions.ACTIVITIES.REQUEST:
      return state.filter(error => error.type !== Activities.actions.ACTIVITIES.FAILURE);
    case Projects.actions.ALL_PROJECTS.FAILURE:
    case Activities.actions.ACTIVITIES.FAILURE:
      return state.concat(action);
    case Projects.actions.SEND_DELETE_PROJECT.REQUEST:
      return state.filter(error =>
        !(error.type !== Projects.actions.SEND_DELETE_PROJECT.FAILURE && (<any> error).id !== action.id)
      );
    case Projects.actions.SEND_DELETE_PROJECT.FAILURE:
      return state.concat(action);
    case CLEAR_PROJECT_DELETION_ERRORS:
      return state.filter(error => error.type !== Projects.actions.SEND_DELETE_PROJECT.FAILURE);
    default:
      return state;
  }
};

export default reducer;
