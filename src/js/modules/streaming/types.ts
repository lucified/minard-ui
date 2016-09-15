import { Action } from 'redux';

export enum ConnectionState {
  OPEN,
  CONNECTING,
  CLOSED,
}

// State
export type StreamingState = {
  state: ConnectionState;
  error?: string;
};

export interface SetConnectionStateAction extends Action {
  state: ConnectionState;
  error?: string;
}
