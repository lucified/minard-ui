import { Reducer } from 'redux';

import { CLOSE_MODAL, OPEN_MODAL } from './actions';
import * as t from './types';

const initialState: t.ModalState = undefined;

const reducer: Reducer<t.ModalState> = (state: t.ModalState = initialState, action: any): t.ModalState => {
  switch (action.type) {
    case OPEN_MODAL:
      if (!state) { // Don't open modal if one is already open
        return {
          type: action.modalType,
        };
      }

      return state;
    case CLOSE_MODAL:
      if (state && state.type === action.modalType) {
        return undefined;
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
