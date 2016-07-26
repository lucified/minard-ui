// Functions in selectors.ts are passed the root state object. Select the appropriate
// member that contains all project data and pass that to the actual selectors in model.ts
import { StateTree } from '../../reducers';
import {
  getActivityForProject as modelGetActivityForProject,
} from './model';

const selectActivityTree = (state: StateTree) => state.entities.activities;

export const getActivityForProject = (state: StateTree, projectId: string) =>
  modelGetActivityForProject(selectActivityTree(state), projectId);
