// Functions in selectors.ts are passed the root state object. Select the appropriate
// member that contains all project data and pass that to the actual selectors in model.ts
import { StateTree } from '../../reducers';
import {
  getBranch as modelGetBranch,
} from './model';

export const getBranch = (state: StateTree, id: string) => modelGetBranch(state.entities.branches, id);
