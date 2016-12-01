import { Action } from 'redux';

import { FetchError } from '../errors';

// State
export interface Preview {
  commit: string;
  deployment: string;
  project: {
    id: string;
    name: string;
  };
  branch: {
    id: string;
    name: string;
  };
  next?: string;
  previous?: string;
}

export interface PreviewState {
  [id: string]: Preview | FetchError;
};

// Actions
// LOAD_PREVIEW
export interface LoadPreviewAction extends Action {
  id: string;
}

// STORE_PREVIEW
export interface StorePreviewAction extends Action {
  preview: Preview;
}
