import { Reducer } from 'redux';

import Projects from '../projects';

import * as t from './types';

const initialState: t.ErrorState = [];

const reducer: Reducer<t.ErrorState> = (state = initialState, action: any) => {
  switch (action.type) {
    case Projects.actions.ALL_PROJECTS.REQUEST:
      return state.filter(error => error.type !== Projects.actions.ALL_PROJECTS.FAILURE);
    case Projects.actions.ALL_PROJECTS.FAILURE:
      return state.concat(action);
    default:
      return state;
  }
};

export default reducer;
