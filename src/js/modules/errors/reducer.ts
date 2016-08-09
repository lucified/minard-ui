import { Reducer } from 'redux';

import Projects from '../projects';

import { CLEAR_FETCH_ALL_PROJECTS_ERRORS } from './actions';
import * as t from './types';

const initialState: t.ErrorState = [];

const reducer: Reducer<t.ErrorState> = (state = initialState, action: any) => {
  switch (action.type) {
    case Projects.actions.ALL_PROJECTS.REQUEST:
    case CLEAR_FETCH_ALL_PROJECTS_ERRORS:
      return state.filter(error => error.type !== Projects.actions.ALL_PROJECTS.FAILURE);
    case Projects.actions.ALL_PROJECTS.FAILURE:
      return state.concat(action);
    default:
      return state;
  }
};

export default reducer;
