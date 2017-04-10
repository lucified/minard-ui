import { LOCATION_CHANGE } from 'react-router-redux';
import { Reducer } from 'redux';

import { CLEAR_STORED_DATA } from '../user';
import * as t from './types';

const initialState: t.SelectedState = {
  project: null,
  branch: null,
  showAll: false,
};

const reducer: Reducer<t.SelectedState> = (state = initialState, action: any) => {
  switch (action.type) {
    case CLEAR_STORED_DATA:
      return initialState;
    case LOCATION_CHANGE:
      const pathname: string = action.payload.pathname;
      const result = /^\/project\/([^/]+)(\/branch\/([^/]+))?/.exec(pathname);
      const project = (result && result[1]) || null;
      const branch = (result && result[3]) || null;
      const showAll = !!/\/all$/.exec(pathname); // This will break if we have an id that is "all"

      if (project !== state.project || branch !== state.branch || showAll !== state.showAll) {
        return {
          project,
          branch,
          showAll,
        };
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
