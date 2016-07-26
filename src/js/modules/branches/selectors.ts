// Functions in selectors.ts are passed the root state object. Select the appropriate
// member that contains all project data and pass that to the actual selectors in model.ts
import { StateTree } from '../../reducers';
import {
  getBranch as modelGetBranch,
} from './model';

const selectBranchTree = (state: StateTree) => state.entities.branches;

export const getBranch = (state: StateTree, id: string) => modelGetBranch(selectBranchTree(state), id);
