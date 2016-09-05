import { ActionCreator } from 'redux';

import * as t from './types';

export const SET_SELECTED = 'SELECTED/SET_SELECTED'; // Not currently used
export const setSelected: ActionCreator<t.SetSelectedAction> =
  (project: string | null, branch: string | null, showAll: boolean) => ({
    type: SET_SELECTED,
    project,
    branch,
    showAll,
  });
