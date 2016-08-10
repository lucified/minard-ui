import { Reducer } from 'redux';

import Activities from '../activities';
import Projects from '../projects';

import { CLEAR_ACTIVITIES_ERRORS, CLEAR_FETCH_ALL_PROJECTS_ERRORS } from './actions';
import * as t from './types';

const initialState: t.ErrorState = [];

const reducer: Reducer<t.ErrorState> = (state = initialState, action: any) => {
  switch (action.type) {
    case Projects.actions.ALL_PROJECTS.REQUEST:
    case CLEAR_FETCH_ALL_PROJECTS_ERRORS:
      return state.filter(error => error.type !== Projects.actions.ALL_PROJECTS.FAILURE);
    case Activities.actions.ACTIVITIES.REQUEST:
    case CLEAR_ACTIVITIES_ERRORS:
      return state.filter(error => error.type !== Activities.actions.ACTIVITIES.FAILURE);
    case Projects.actions.ALL_PROJECTS.FAILURE:
    case Activities.actions.ACTIVITIES.FAILURE:
      return state.concat(action);
    default:
      return state;
  }
};

export default reducer;
