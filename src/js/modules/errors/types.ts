// State
export type ErrorState = Error[];

export interface ClearProjectDeletionErrorAction {
  type: 'ERRORS/CLEAR_PROJECT_DELETION_ERROR';
  id?: string;
}

export interface ClearSignupErrorAction {
  type: 'ERRORS/CLEAR_SIGNUP_ERROR';
}

export interface SignupErrorAction {
  type: 'ERRORS/SIGNUP_ERROR';
  error: string;
  details?: string;
}

// Error types
interface GenericError {
  // The type of action that produced the error
  type: string;
  // The original error message
  error: string;
  // Detailed error message
  details?: string;
  // The error to display to the user
  prettyError: string;
  unauthorized?: boolean;
}

export type Error = FetchError | FetchCollectionError | CreateError | DeleteError | EditError;

export interface FetchError extends GenericError {
  id: string;
}

export function isFetchError(obj: any): obj is FetchError {
  const possiblyError = obj as FetchError;
  return possiblyError &&
    possiblyError.type !== undefined &&
    possiblyError.error !== undefined &&
    possiblyError.id !== undefined;
}

export interface FetchCollectionError extends GenericError {

}

export interface CreateError extends GenericError {
  name: string;
}

export interface DeleteError extends GenericError {
  id: string;
}

export const isDeleteError = (obj: any): obj is DeleteError => {
  const possiblyError = obj as DeleteError;
  return possiblyError &&
    possiblyError.type !== undefined &&
    possiblyError.error !== undefined &&
    possiblyError.id !== undefined;
};

export interface EditError extends GenericError {
  id: string;
}

export interface SignupError extends GenericError {}
