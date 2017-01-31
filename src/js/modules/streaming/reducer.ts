import { Reducer } from 'redux';

import { SET_CONNECTION_STATE } from './actions';
import * as t from './types';

const initialState: t.StreamingState = { state: t.ConnectionState.INITIAL_CONNECT };

const reducer: Reducer<t.StreamingState> = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_CONNECTION_STATE:
      const { state: connectionState, error } = action as t.SetConnectionStateAction;
      if (connectionState !== state.state || error !== state.error) {
        return { state: connectionState, error };
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
