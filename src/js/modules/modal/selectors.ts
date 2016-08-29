import { StateTree } from '../../reducers';

import * as t from './types';

const selectModalTree = (state: StateTree) => state.modal;

export const isModalOpenOfType = (state: StateTree, type: t.ModalType): boolean => {
  const openModal = selectModalTree(state);
  return !!openModal && openModal.type === type;
};

export const isModalOpen = (state: StateTree): boolean => {
  return !!selectModalTree(state);
};
