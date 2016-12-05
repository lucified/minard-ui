import { Action } from 'redux';

import { FetchError } from '../errors';

// State
export interface Comment {
  id: string;
  message: string;
  deployment: string;
  timestamp: number;
  email: string;
  name?: string;
}

export interface CommentState {
  [id: string]: Comment | FetchError;
};

// Actions
// LOAD_COMMENTS_FOR_DEPLOYMENT
export interface LoadCommentsForDeploymentAction extends Action {
  id: string;
}

// STORE_COMMENTS
export interface StoreCommentsAction extends Action {
  entities: Comment[];
}
