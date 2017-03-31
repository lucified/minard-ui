import { mapKeys, omit } from 'lodash';
import { Reducer } from 'redux';

import { CLEAR_STORED_DATA } from '../user';
import { REMOVE_COMMENT, STORE_COMMENTS } from './actions';
import * as t from './types';

const initialState: t.CommentState = {};

const reducer: Reducer<t.CommentState> = (state = initialState, action: any) => {
  switch (action.type) {
    case STORE_COMMENTS:
      const comments = (action as t.StoreCommentsAction).entities;
      if (comments && comments.length > 0) {
        const newCommentsObject: t.CommentState = mapKeys(comments, c => c.id);

        return {
          ...state,
          ...newCommentsObject,
        };
      }

      return state;
    case REMOVE_COMMENT:
      const id = (action as t.RemoveCommentAction).id;
      if (state[id]) {
        return omit<t.CommentState, t.CommentState>(state, id);
      }

      return state;
    case CLEAR_STORED_DATA:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
