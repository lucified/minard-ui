import { FetchError } from '../errors';

// State
export interface Preview {
  commit: string;
  deployment: string;
  project: {
    id: string,
    name: string,
  };
  branch: {
    id: string,
    name: string,
  };

  // Currently not available from the API and not used
  next?: string;
  previous?: string;
}

export interface PreviewState {
  // The Preview is stored into the state with the key: `${entityType}-${id}`
  [id: string]: Preview | FetchError;
}

// Actions
// LOAD_PREVIEW_AND_COMMENTS
export type EntityType = 'project' | 'branch' | 'deployment';
export interface LoadPreviewAndCommentsAction {
  type: 'PREVIEW/LOAD_PREVIEW_AND_COMMENTS';
  id: string;
  entityType: EntityType;
  token: string;
  isUserLoggedIn: boolean;
}

export function isEntityType(s: string): s is EntityType {
  return ['project', 'branch', 'deployment'].indexOf(s) > -1;
}

// STORE_PREVIEW
export interface StorePreviewAction {
  type: 'PREVIEW/STORE_PREVIEW';
  preview: Preview;
  requestedEntityType: EntityType;
  requestedId: string;
}
