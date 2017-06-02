import { ConnectionState, SetConnectionStateAction } from './types';

export const SET_CONNECTION_STATE = 'STREAMING/SET_CONNECTION_STATE';

export const setConnectionState = (
  state: ConnectionState,
  error?: string,
): SetConnectionStateAction => ({
  type: SET_CONNECTION_STATE,
  state,
  error,
});
