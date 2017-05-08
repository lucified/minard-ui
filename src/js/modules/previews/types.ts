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

  // Currently not available from the API and not used
  next?: string;
  previous?: string;
}

export interface PreviewState {
  [id: string]: Preview | FetchError;
}

// Actions
// LOAD_PREVIEW_AND_COMMENTS
export type EntityType = 'project' | 'branch' | 'deployment';
export interface LoadPreviewAndCommentsAction extends Action {
  id: string;
  entityType: EntityType;
  token: string;
  isUserLoggedIn: boolean;
}

// STORE_PREVIEW
export interface StorePreviewAction extends Action {
  preview: Preview;
}
