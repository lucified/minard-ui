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
}

// Actions
export interface DeleteCommentAction {
  type: 'COMMENTS/DELETE_COMMENT';
  id: string;
}

export interface StoreCommentsAction {
  type: 'COMMENTS/STORE_COMMENTS';
  entities: Comment[];
}

export interface RemoveCommentAction {
  type: 'COMMENTS/REMOVE_COMMENT';
  id: string;
}

export interface CreateCommentFormData {
  name?: string;
  email: string;
  message: string;
  deployment: string;
}

export interface CreateCommentAction {
  type: 'COMMENTS/CREATE_COMMENT';
  payload: CreateCommentFormData;
}
