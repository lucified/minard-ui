import { Action } from 'redux';

// State
export interface SelectedState {
  project: string | null;
  branch: string | null;
  showAll: boolean;
}

// Actions
export interface SetSelectedAction extends Action {
  project: string | null;
  branch: string | null;
  showAll: boolean;
}
