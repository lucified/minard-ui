import { values } from 'lodash';
import { createSelector } from 'reselect';

import { StateTree } from '../../reducers';
import { Branch } from './types';

const selectBranchTree = (state: StateTree) => state.entities.branches;

const getBranches = createSelector(
  selectBranchTree,
  branches => values<Branch>(branches)
);

export const getBranch = (state: StateTree, id: string) => selectBranchTree(state)[id];
export const getBranchByNameAndProject = (state: StateTree, name: string, projectId: string) =>
  _.find(getBranches(state), branch => branch.name === name && branch.project === projectId);
