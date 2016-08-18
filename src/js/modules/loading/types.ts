import { Action } from 'redux';

// State
export interface LoadingInformation {
  type: string;
  id?: string;
}

export type LoadingState = LoadingInformation[];

export interface ClearErrorAction extends Action {
  type: string;
  id?: string;
}
