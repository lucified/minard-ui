import { Reducer } from 'redux';

import { ActivityState } from './types';

const initialState: ActivityState = {};

const reducer: Reducer<ActivityState> = (state: ActivityState = initialState, _: any) => {
  return state;
};

export default reducer;
