import { EntityType, LoadPreviewAndCommentsAction, Preview, StorePreviewAction } from './types';

export const STORE_PREVIEW = 'PREVIEW/STORE_PREVIEW';
export const storePreviews = (preview: Preview): StorePreviewAction => ({
  type: STORE_PREVIEW,
  preview,
});

export const LOAD_PREVIEW_AND_COMMENTS = 'PREVIEW/LOAD_PREVIEW_AND_COMMENTS';
export const loadPreviewAndComments = (
  id: string,
  entityType: EntityType,
  token: string,
  isUserLoggedIn: boolean,
): LoadPreviewAndCommentsAction => ({
  type: LOAD_PREVIEW_AND_COMMENTS,
  entityType,
  id,
  token,
  isUserLoggedIn,
});
