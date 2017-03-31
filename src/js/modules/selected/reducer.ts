import { Reducer } from 'redux';

import { CLEAR_STORED_DATA } from '../user';
import { SET_SELECTED } from './actions';
import * as t from './types';

const initialState: t.SelectedState = {
  project: null,
  branch: null,
  showAll: false,
};

const reducer: Reducer<t.SelectedState> = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_SELECTED:
      const { project, branch, showAll } = action;

      if (project !== state.project || branch !== state.branch || showAll !== state.showAll) {
        return {
          project,
          branch,
          showAll,
        };
      }

      return state;
    case CLEAR_STORED_DATA:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
