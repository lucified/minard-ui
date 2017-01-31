import { Action } from 'redux';

export enum ConnectionState {
  OPEN,
  INITIAL_CONNECT,
  CONNECTING,
  CLOSED,
}

// State
export interface StreamingState {
  state: ConnectionState;
  error?: string;
};

export interface SetConnectionStateAction extends Action {
  state: ConnectionState;
  error?: string;
}
