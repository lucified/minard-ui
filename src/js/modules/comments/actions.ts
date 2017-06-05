import {
  Comment,
  DeleteCommentAction,
  RemoveCommentAction,
  StoreCommentsAction,
} from './types';

export const DELETE_COMMENT = 'COMMENTS/DELETE_COMMENT';
export const deleteComment = (id: string): DeleteCommentAction => ({
  type: DELETE_COMMENT,
  id,
});

export const STORE_COMMENTS = 'COMMENTS/STORE_COMMENTS';
export const storeComments = (comments: Comment[]): StoreCommentsAction => ({
  type: STORE_COMMENTS,
  entities: comments,
});

export const REMOVE_COMMENT = 'COMMENTS/REMOVE_COMMENT';
export const removeComment = (id: string): RemoveCommentAction => ({
  type: REMOVE_COMMENT,
  id,
});

// Action creators are handled by redux-form
export const CREATE_COMMENT = 'COMMENTS/CREATE_COMMENT';
