// Functions in selectors.ts are passed the root state object. Select the appropriate
// member that contains all project data and pass that to the actual selectors in model.ts
import { StateTree } from '../../reducers';
import {
  getBranches as modelGetBranches,
  getIDs as modelGetIDs,
  getProject as modelGetProject,
  getProjects as modelGetProjects,
} from './model';

const selectProjectTree = (state: StateTree) => state.entities.projects;

export const getIDs = (state: StateTree) => modelGetIDs(selectProjectTree(state));
export const getProjects = (state: StateTree) => modelGetProjects(selectProjectTree(state));
export const getProject = (state: StateTree, id: string) => modelGetProject(selectProjectTree(state), id);
export const getBranches = (state: StateTree, id: string) => modelGetBranches(selectProjectTree(state), id);
