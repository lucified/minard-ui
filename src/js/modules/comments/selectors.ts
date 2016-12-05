import { StateTree } from '../../reducers';

import * as t from './types';

const selectCommentTree = (state: StateTree): t.CommentState => state.entities.comments;

export const getComment = (state: StateTree, id: string): t.Comment | undefined =>
  selectCommentTree(state)[id];
