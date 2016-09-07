import { values } from 'lodash';

import { StateTree } from '../../reducers';
import { isFetchError } from '../errors';

const selectBranchTree = (state: StateTree) => state.entities.branches;

export const getBranch = (state: StateTree, id: string) => selectBranchTree(state)[id];
export const getBranchesForProject = (state: StateTree, id: string) =>
  values(selectBranchTree(state)).filter(branch => !isFetchError(branch) && branch.project === id);
