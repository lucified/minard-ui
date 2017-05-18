import { mapKeys, omit } from 'lodash';
import { Reducer } from 'redux';

import { CLEAR_STORED_DATA } from '../user';
import { REMOVE_COMMENT, STORE_COMMENTS } from './actions';
import { CommentState, RemoveCommentAction, StoreCommentsAction } from './types';

const initialState: CommentState = {};

const reducer: Reducer<CommentState> = (state = initialState, action: any) => {
  switch (action.type) {
    case STORE_COMMENTS:
      const comments = (action as StoreCommentsAction).entities;
      if (comments && comments.length > 0) {
        const newCommentsObject: CommentState = mapKeys(comments, c => c.id);

        return {
          ...state,
          ...newCommentsObject,
        };
      }

      return state;
    case REMOVE_COMMENT:
      const id = (action as RemoveCommentAction).id;
      if (state[id]) {
        return omit<CommentState, CommentState>(state, id);
      }

      return state;
    case CLEAR_STORED_DATA:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
