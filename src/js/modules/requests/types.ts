import { Action } from 'redux';

// State
export interface RequestInformation {
  type: string;
  id?: string;
}

export type RequestsState = RequestInformation[];

export interface ClearErrorAction extends Action {
  type: string;
  id?: string;
}
