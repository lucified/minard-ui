import { Reducer } from 'redux';

import { SET_SELECTED } from './actions';
import * as t from './types';

const initialState: t.SelectedState = {
  project: null,
  branch: null,
};

const reducer: Reducer<t.SelectedState> = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_SELECTED:
      const { project, branch } = action;
      return {
        project,
        branch,
      };
    default:
      return state;
  }
};

export default reducer;
