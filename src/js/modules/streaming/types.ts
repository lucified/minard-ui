export enum ConnectionState {
  OPEN,
  INITIAL_CONNECT,
  CONNECTING,
  CLOSED
}

// State
export interface StreamingState {
  state: ConnectionState;
  error?: string;
}

export interface SetConnectionStateAction {
  type: 'STREAMING/SET_CONNECTION_STATE';
  state: ConnectionState;
  error?: string;
}
