import * as t from './types';

export const LOAD_COMMENTS_FOR_DEPLOYMENT = 'COMMENTS/LOAD_COMMENTS_FOR_DEPLOYMENT';
export const loadCommentsForDeployment = (id: string): t.LoadCommentsForDeploymentAction => ({
  type: LOAD_COMMENTS_FOR_DEPLOYMENT,
  id,
});

export const DELETE_COMMENT = 'COMMENTS/DELETE_COMMENT';
export const deleteComment = (id: string): t.DeleteCommentAction => ({
  type: DELETE_COMMENT,
  id,
});

export const STORE_COMMENTS = 'COMMENTS/STORE_COMMENTS';
export const storeComments = (comments: t.Comment[]): t.StoreCommentsAction => ({
  type: STORE_COMMENTS,
  entities: comments,
});

export const REMOVE_COMMENT = 'COMMENTS/REMOVE_COMMENT';
export const removeComment = (id: string): t.RemoveCommentAction => ({
  type: REMOVE_COMMENT,
  id,
});

// Action creators are handled by redux-form
export const CREATE_COMMENT = 'COMMENTS/CREATE_COMMENT';
