import { Reducer } from 'redux';

import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';

import { STORE_PREVIEW } from './actions';
import * as t from './types';

const initialState: t.PreviewState = {};

const reducer: Reducer<t.PreviewState> = (state = initialState, action: any) => {
  switch (action.type) {
    case Requests.actions.Previews.LoadPreview.FAILURE.type:
      const responseAction = <FetchError> action;
      const id = responseAction.id;
      const existingEntity = state[id];
      if (!existingEntity || isFetchError(existingEntity)) {
        return Object.assign({}, state, { [id]: responseAction });
      }

      console.error('Fetching of preview failed! Not replacing existing entity.');

      return state;
    case STORE_PREVIEW:
      const preview = (<t.StorePreviewAction> action).preview;
      if (preview) {
        return Object.assign({}, state, { [preview.id]: preview });
      }

      console.error('No preview found when storing preview.', action);

      return state;
    default:
      return state;
  }
};

export default reducer;
