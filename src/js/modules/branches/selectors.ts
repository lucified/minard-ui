import { StateTree } from '../../reducers';

const selectBranchTree = (state: StateTree) => state.entities.branches;

export const getBranch = (state: StateTree, id: string) => selectBranchTree(state)[id];
