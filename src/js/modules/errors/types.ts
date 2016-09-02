import { Action } from 'redux';

// State
export type ErrorState = Error[];

export interface ClearErrorAction extends Action {
  id?: string;
}

// Error types
interface GenericError {
  // The type of action that produced the error
  type: string;
  // The original error message
  error: string;
  // The error to display to the user
  prettyError: string;
}

export type Error = FetchError | FetchCollectionError | CreateError | DeleteError | EditError;

export interface FetchError extends GenericError {
  id: string;
}

export const isFetchError = (obj: any): obj is FetchError => {
  const possiblyError = (<FetchError> obj);
  return possiblyError &&
    possiblyError.type !== undefined &&
    possiblyError.error !== undefined &&
    possiblyError.id !== undefined;
};

export interface FetchCollectionError extends GenericError {

}

export interface CreateError extends GenericError {

}

export interface DeleteError extends GenericError {
  id: string;
}

export const isDeleteError = (obj: any): obj is DeleteError => {
  const possiblyError = (<DeleteError> obj);
  return possiblyError &&
    possiblyError.type !== undefined &&
    possiblyError.error !== undefined &&
    possiblyError.id !== undefined;
};

export interface EditError extends GenericError {
  id: string;
}
