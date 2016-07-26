// Functions in selectors.ts are passed the root state object. Select the appropriate
// member that contains all project data and pass that to the actual selectors in model.ts
import { StateTree } from '../../reducers';
import {
  getCommit as modelGetCommit,
} from './model';

export const getCommit = (state: StateTree, id: string) => modelGetCommit(state.entities.commits, id);
