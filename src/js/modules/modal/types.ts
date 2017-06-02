export enum ModalType {

  NewProject,
  ProjectSettings,
  Account,
  TeamSettings,
  InviteTeam

}

// State
export interface ModalDialog {
  type: ModalType;
}

export type ModalState = ModalDialog | null;

// Actions
export interface OpenModalAction {
  type: 'MODALS/OPEN_MODAL';
  modalType: ModalType;
}

export interface CloseModalAction {
  type: 'MODALS/CLOSE_MODAL';
  modalType: ModalType;
}
