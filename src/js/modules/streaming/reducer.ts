import { Reducer } from 'redux';

import { SET_CONNECTION_STATE } from './actions';
import { ConnectionState, SetConnectionStateAction, StreamingState } from './types';

const initialState: StreamingState = { state: ConnectionState.INITIAL_CONNECT };

const reducer: Reducer<StreamingState> = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_CONNECTION_STATE:
      const { state: connectionState, error } = action as SetConnectionStateAction;
      if (connectionState !== state.state || error !== state.error) {
        return { state: connectionState, error };
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
