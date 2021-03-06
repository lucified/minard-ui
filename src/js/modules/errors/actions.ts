import {
  ClearProjectDeletionErrorAction,
  ClearSignupErrorAction,
  SignupError,
} from './types';

export const CLEAR_PROJECT_DELETION_ERRORS =
  'ERRORS/CLEAR_PROJECT_DELETION_ERROR';
export const clearProjectDeletionErrors = (): ClearProjectDeletionErrorAction => ({
  type: CLEAR_PROJECT_DELETION_ERRORS,
});

export const SIGNUP_ERROR = 'ERRORS/SIGNUP_ERROR';
export const signupError = (error: string, details: string): SignupError => ({
  type: SIGNUP_ERROR,
  error,
  details,
  prettyError: error,
});

export const CLEAR_SIGNUP_ERROR = 'ERRORS/CLEAR_SIGNUP_ERROR';
export const clearSignupError = (): ClearSignupErrorAction => ({
  type: CLEAR_SIGNUP_ERROR,
});
