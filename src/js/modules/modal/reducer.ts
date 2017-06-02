import { Reducer } from 'redux';

import { CLEAR_STORED_DATA } from '../user';
import { CLOSE_MODAL, OPEN_MODAL } from './actions';
import { ModalState } from './types';

const initialState: ModalState = null;

const reducer: Reducer<ModalState> = (
  state: ModalState = initialState,
  action: any,
): ModalState => {
  switch (action.type) {
    case OPEN_MODAL:
      if (!state) {
        // Don't open modal if one is already open
        return {
          type: action.modalType,
        };
      }

      return state;
    case CLOSE_MODAL:
      if (state && state.type === action.modalType) {
        return null;
      }

      return state;
    case CLEAR_STORED_DATA:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
