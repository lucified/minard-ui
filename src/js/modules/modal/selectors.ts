import { StateTree } from '../../reducers';

import { ModalType } from './types';

const selectModalTree = (state: StateTree) => state.modal;

export const isModalOpenOfType = (
  state: StateTree,
  type: ModalType,
): boolean => {
  const openModal = selectModalTree(state);
  return !!openModal && openModal.type === type;
};

export const isModalOpen = (state: StateTree): boolean => {
  return !!selectModalTree(state);
};
