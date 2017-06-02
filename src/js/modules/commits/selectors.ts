import { StateTree } from '../../reducers';
import { FetchError } from '../errors';

import { Commit } from './types';

const selectCommitTree = (state: StateTree) => state.entities.commits;

export const getCommit = (
  state: StateTree,
  id: string,
): Commit | FetchError | undefined => selectCommitTree(state)[id];
