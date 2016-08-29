import { ActionCreator } from 'redux';

import * as t from './types';

export const OPEN_MODAL = 'MODALS/OPEN_MODAL';
export const CLOSE_MODAL = 'MODALS/CLOSE_MODAL';

export const openModal: ActionCreator<t.OpenModalAction> = (modalType: t.ModalType) => {
  return {
    type: OPEN_MODAL,
    modalType,
  };
};

export const closeModal: ActionCreator<t.CloseModalAction> = (modalType: t.ModalType) => {
  return {
    type: CLOSE_MODAL,
    modalType,
  };
};
