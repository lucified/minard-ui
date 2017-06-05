import { StateTree } from '../../reducers';

import { Comment, CommentState } from './types';

const selectCommentTree = (state: StateTree): CommentState =>
  state.entities.comments;

export const getComment = (state: StateTree, id: string): Comment | undefined =>
  selectCommentTree(state)[id];
