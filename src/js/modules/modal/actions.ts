import * as t from './types';

export const OPEN_MODAL = 'MODALS/OPEN_MODAL';
export const CLOSE_MODAL = 'MODALS/CLOSE_MODAL';

export const openModal = (modalType: t.ModalType): t.OpenModalAction => ({
  type: OPEN_MODAL,
  modalType,
});

export const closeModal = (modalType: t.ModalType): t.CloseModalAction => ({
  type: CLOSE_MODAL,
  modalType,
});
