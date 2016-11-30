import * as t from './types';

export const STORE_PREVIEW = 'PREVIEW/STORE_PREVIEW';
export const storePreviews = (preview: t.Preview): t.StorePreviewAction => ({
  type: STORE_PREVIEW,
  preview,
});

export const LOAD_PREVIEW = 'PREVIEW/LOAD_PREVIEW';
export const loadPreview = (id: string): t.LoadPreviewAction => ({
  type: LOAD_PREVIEW,
  id,
});
