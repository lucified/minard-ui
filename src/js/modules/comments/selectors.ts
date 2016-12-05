import { StateTree } from '../../reducers';
import { FetchError } from '../errors';

import * as t from './types';

const selectCommentTree = (state: StateTree): t.CommentState => state.entities.comments;

export const getComment = (state: StateTree, id: string): t.Comment | FetchError | undefined =>
  selectCommentTree(state)[id];
