import { Action } from 'redux';

import { ActivityState } from './types';

const initialState: ActivityState = {};

export default (state: ActivityState = initialState, _: Action) => {
  return state;
};
