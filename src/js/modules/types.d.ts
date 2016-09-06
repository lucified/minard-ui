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

export interface RequestFetchActionCreators<R, ResponseEntity, S, F> {
  request: (id: string) => R;
  success: (id: string, response: ResponseEntity) => S;
  failure: (id: string, error: string, details?: string) => F;
}

export interface RequestFetchCollectionActionCreators<R, ResponseEntity, S, F> {
  request: () => R;
  success: (response: ResponseEntity) => S;
  failure: (error: string, details?: string) => F;
}

export interface RequestCreateActionCreators<R, S, F> {
  request: (name: string) => R;
  success: (id: string) => S;
  failure: (error: string, details?: string) => F;
}

export interface RequestEditActionCreators<R, S, F> {
  request: (id: string) => R;
  success: (id: string) => S;
  failure: (id: string, error: string, details?: string) => F;
}

export interface RequestDeleteActionCreators<R, S, F> {
  request: (id: string) => R;
  success: (id: string) => S;
  failure: (id: string, error: string, details?: string) => F;
}
