import * as t from './types';

export const SET_SELECTED = 'SELECTED/SET_SELECTED'; // Not currently used
export const setSelected =
  (project: string | null, branch: string | null, showAll: boolean): t.SetSelectedAction => ({
    type: SET_SELECTED,
    project,
    branch,
    showAll,
  });
