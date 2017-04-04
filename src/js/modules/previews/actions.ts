import * as t from './types';

export const STORE_PREVIEW = 'PREVIEW/STORE_PREVIEW';
export const storePreviews = (preview: t.Preview): t.StorePreviewAction => ({
  type: STORE_PREVIEW,
  preview,
});

export const LOAD_PREVIEW_AND_COMMENTS = 'PREVIEW/LOAD_PREVIEW_AND_COMMENTS';
export const loadPreviewAndComments = (
  id: string,
  commitHash: string,
  isUserLoggedIn: boolean,
): t.LoadPreviewAndCommentsAction => ({
  type: LOAD_PREVIEW_AND_COMMENTS,
  id,
  commitHash,
  isUserLoggedIn,
});
