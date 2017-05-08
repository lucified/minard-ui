import { Reducer } from 'redux';

import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';

import { CLEAR_STORED_DATA } from '../user';
import { STORE_PREVIEW } from './actions';
import { Preview, PreviewState, StorePreviewAction } from './types';

const initialState: PreviewState = {};

const reducer: Reducer<PreviewState> = (state = initialState, action: any) => {
  switch (action.type) {
    case Requests.actions.Previews.LoadPreview.FAILURE.type:
      const responseAction = action as FetchError;
      const id = responseAction.id;
      const existingEntity = state[id];
      if (!existingEntity || isFetchError(existingEntity)) {
        return {
          ...state,
          [id]: responseAction,
        };
      }

      console.error('Fetching of preview failed! Not replacing existing entity.');

      return state;
    case STORE_PREVIEW:
      const preview: Preview = (action as StorePreviewAction).preview;
      if (preview) {
        return {
          ...state,
          [preview.deployment]: preview,
        };
      }

      console.error('No preview found when storing preview.', action);

      return state;
    case CLEAR_STORED_DATA:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
