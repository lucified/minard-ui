import * as t from './types';

export const LOAD_COMMENTS_FOR_DEPLOYMENT = 'COMMENTS/LOAD_COMMENTS_FOR_DEPLOYMENT';
export const loadCommentsForDeployment = (id: string): t.LoadCommentsForDeploymentAction => ({
  type: LOAD_COMMENTS_FOR_DEPLOYMENT,
  id,
});

export const STORE_COMMENTS = 'COMMENTS/STORE_COMMENTS';
export const storeComments = (comments: t.Comment[]): t.StoreCommentsAction => ({
  type: STORE_COMMENTS,
  entities: comments,
});

// Action creators are handled by redux-form
export const CREATE_COMMENT = 'COMMENTS/CREATE_COMMENT';
