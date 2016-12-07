import { Action } from 'redux';

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
  [id: string]: Comment;
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

// CREATE_COMMENT
export interface CreateCommentFormData {
  name?: string;
  email: string;
  message: string;
  deployment: string;
}

export interface CreateCommentAction extends Action {
  payload: CreateCommentFormData;
}
