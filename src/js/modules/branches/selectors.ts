import { values } from 'lodash';

import { StateTree } from '../../reducers';
import { FetchError, isFetchError } from '../errors';

import * as t from './types';

const selectBranchTree = (state: StateTree) => state.entities.branches;

export const getBranch = (state: StateTree, id: string): t.Branch | FetchError | undefined =>
  selectBranchTree(state)[id];
export const getBranchesForProject = (state: StateTree, id: string) =>
  values(selectBranchTree(state)).filter(branch => !isFetchError(branch) && branch.project === id);
