import { Action } from 'redux';

export enum ModalType {
  NewProject,
  ProjectSettings,
  UserProfile,
  TeamSettings,
}

// State
export interface ModalDialog {
  type: ModalType;
}

export type ModalState = ModalDialog | undefined;

// Actions
export interface OpenModalAction extends Action {
  modalType: ModalType;
}

export interface CloseModalAction extends Action {
  modalType: ModalType;
}
