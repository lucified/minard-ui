import { StateTree } from '../../reducers';
import { FetchError } from '../errors';

import * as t from './types';

const selectCommitTree = (state: StateTree) => state.entities.commits;

export const getCommit = (state: StateTree, id: string): t.Commit | FetchError | undefined =>
  selectCommitTree(state)[id];
