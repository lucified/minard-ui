import { Reducer } from 'redux';

import { logMessage } from '../../logger';
import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';

import { STORE_COMMENTS } from './actions';
import * as t from './types';

const initialState: t.CommentState = {};

const reducer: Reducer<t.CommentState> = (state = initialState, action: any) => {
  let comments: t.Comment[];
  let comment: t.Comment | FetchError | undefined;
  let id: string;

  switch (action.type) {
    case Requests.actions.Comments.LoadCommentsForDeployment.FAILURE.type:
      const responseAction = <FetchError> action;
      id = responseAction.id;
      comment = state[id];
      if (!comment || isFetchError(comment)) {
        return Object.assign({}, state, { [id]: responseAction });
      }

      logMessage('Fetching failed! Not replacing existing entity.', { action });

      return state;
    case STORE_COMMENTS:
      comments = (<t.StoreCommentsAction> action).entities;
      if (comments && comments.length > 0) {
        const newCommentsObject: t.CommentState =
          comments.reduce<t.CommentState>((obj: t.CommentState, newComment: t.Comment) =>
            Object.assign(obj, { [newComment.id]: newComment }),
          {});

        return Object.assign({}, state, newCommentsObject);
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
