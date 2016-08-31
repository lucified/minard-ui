import { Action } from 'redux';

// State
export interface FetchError {
  // The type of action that produced the error
  type: string;
  // If the error concerns a specific entity, the id of that entity
  id: string | null;
  // The original error message
  error: string;
  // The error to display to the user
  prettyError: string;
}

export type ErrorState = FetchError[];

export const isError = (obj: any): obj is FetchError => {
  const possiblyError = (<FetchError> obj);
  return possiblyError && possiblyError.type !== undefined && possiblyError.error !== undefined;
};

export interface ClearErrorAction extends Action {
  id?: string;
}

export interface CreateError {
  type: string;
  error: string;
  _error: string; // For forms
}
