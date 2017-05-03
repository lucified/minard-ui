import { CloseModalAction, ModalType, OpenModalAction } from './types';

export const OPEN_MODAL = 'MODALS/OPEN_MODAL';
export const CLOSE_MODAL = 'MODALS/CLOSE_MODAL';

export const openModal = (modalType: ModalType): OpenModalAction => ({
  type: OPEN_MODAL,
  modalType,
});

export const closeModal = (modalType: ModalType): CloseModalAction => ({
  type: CLOSE_MODAL,
  modalType,
});
