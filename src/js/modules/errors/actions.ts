import * as t from './types';

export const CLEAR_PROJECT_DELETION_ERRORS = 'ERRORS/CLEAR_PROJECT_DELETION_ERROR';
export const clearProjectDeletionErrors = (): t.ClearProjectDeletionErrorAction => ({
  type: CLEAR_PROJECT_DELETION_ERRORS,
});

export const SIGNUP_ERROR = 'ERRORS/SIGNUP_ERROR';
export const signupError = (error: string, details: string): t.SignupErrorAction => ({
  type: SIGNUP_ERROR,
  error,
  details,
});

export const CLEAR_SIGNUP_ERROR = 'ERRORS/CLEAR_SIGNUP_ERROR';
export const clearSignupError = (): t.ClearSignupErrorAction => ({
  type: CLEAR_SIGNUP_ERROR,
});
