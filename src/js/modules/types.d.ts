import { ActionCreator } from 'redux';

export interface User {
  name?: string;
  email: string;
  timestamp: number;
}

export interface ApiUser {
  name?: string;
  email: string;
  timestamp: string;
}

export interface RequestActionCreators<R, S, F> {
  request: ActionCreator<R>;
  success: ActionCreator<S>;
  failure: ActionCreator<F>;
}
