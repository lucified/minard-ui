import * as t from './types';

export const SET_CONNECTION_STATE = 'STREAMING/SET_CONNECTION_STATE';

export const setConnectionState = (state: t.ConnectionState, error?: string): t.SetConnectionStateAction => ({
  type: SET_CONNECTION_STATE,
  state,
  error,
});
