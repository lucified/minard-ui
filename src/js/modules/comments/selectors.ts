import { values } from 'lodash';

import { StateTree } from '../../reducers';
import { FetchError, isFetchError } from '../errors';

import * as t from './types';

const selectCommentTree = (state: StateTree): t.CommentState => state.entities.comments;

export const getComment = (state: StateTree, id: string): t.Comment | FetchError | undefined =>
  selectCommentTree(state)[id];
export const getCommentsForDeployment = (state: StateTree, id: string): t.Comment[] =>
  values<t.Comment>(selectCommentTree(state)).filter(
    commentOrError => !isFetchError(commentOrError) && commentOrError.deployment === id,
  );
