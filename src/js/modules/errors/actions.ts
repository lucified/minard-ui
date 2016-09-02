import { ActionCreator } from 'redux';

import * as t from './types';

export const CLEAR_PROJECT_DELETION_ERRORS = 'ERRORS/CLEAR_PROJECT_DELETION_ERROR';

export const clearProjectDeletionErrors: ActionCreator<t.ClearErrorAction> = () => ({
  type: CLEAR_PROJECT_DELETION_ERRORS,
});
