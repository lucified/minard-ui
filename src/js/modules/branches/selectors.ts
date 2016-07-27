import * as _ from 'lodash';

import { StateTree } from '../../reducers';
import { Branch } from './types';

const selectBranchTree = (state: StateTree) => state.entities.branches;
const getBranches = (state: StateTree) => _.values<Branch>(selectBranchTree(state));

export const getBranch = (state: StateTree, id: string) => selectBranchTree(state)[id];
export const getBranchByNameAndProject = (state: StateTree, name: string, projectId: string) =>
  _.find(getBranches(state), branch => branch.name === name && branch.project === projectId);
