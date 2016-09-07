import { Action } from 'redux';

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

export interface RequestFetchActionCreators<R extends Action, ResponseEntity, S extends Action, F extends Action> {
  request: (id: string) => R;
  success: (id: string, response: ResponseEntity) => S;
  failure: (id: string, error: string, details?: string) => F;
}

export interface RequestFetchCollectionActionCreators<R extends Action, ResponseEntity, S extends Action, F extends Action> {
  request: () => R;
  success: (response: ResponseEntity) => S;
  failure: (error: string, details?: string) => F;
}

export interface RequestCreateActionCreators<R extends Action, S extends Action, F extends Action> {
  request: (name: string) => R;
  success: (id: string) => S;
  failure: (error: string, details?: string) => F;
}

export interface RequestEditActionCreators<R extends Action, S extends Action, F extends Action> {
  request: (id: string) => R;
  success: (id: string) => S;
  failure: (id: string, error: string, details?: string) => F;
}

export interface RequestDeleteActionCreators<R extends Action, S extends Action, F extends Action> {
  request: (id: string) => R;
  success: (id: string) => S;
  failure: (id: string, error: string, details?: string) => F;
}
