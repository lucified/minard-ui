// Functions in selectors.ts are passed the root state object. Select the appropriate
// member that contains all project data and pass that to the actual selectors in model.ts
import { StateTree } from '../../reducers';
import {
  getBranches as modelGetBranches,
  getIDs as modelGetIDs,
  getProject as modelGetProject,
  getProjects as modelGetProjects,
} from './model';

export const getIDs = (state: StateTree) => modelGetIDs(state.entities.projects);
export const getProjects = (state: StateTree) => modelGetProjects(state.entities.projects);
export const getProject = (state: StateTree, id: string) => modelGetProject(state.entities.projects, id);
export const getBranches = (state: StateTree, id: string) => modelGetBranches(state.entities.projects, id);
