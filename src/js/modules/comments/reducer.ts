import { omit } from 'lodash';
import { Reducer } from 'redux';

import { REMOVE_COMMENT, STORE_COMMENTS } from './actions';
import * as t from './types';

const initialState: t.CommentState = {};

const reducer: Reducer<t.CommentState> = (state = initialState, action: any) => {
  switch (action.type) {
    case STORE_COMMENTS:
      const comments = (<t.StoreCommentsAction> action).entities;
      if (comments && comments.length > 0) {
        const newCommentsObject: t.CommentState =
          comments.reduce<t.CommentState>((obj: t.CommentState, newComment: t.Comment) =>
            Object.assign(obj, { [newComment.id]: newComment }),
          {});

        return Object.assign({}, state, newCommentsObject);
      }

      return state;
    case REMOVE_COMMENT:
      const id = (<t.RemoveCommentAction> action).id;
      if (state[id]) {
        return omit<t.CommentState, t.CommentState>(state, id);
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
