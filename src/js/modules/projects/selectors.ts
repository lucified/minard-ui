// Functions in selectors.ts are passed the root state object. Select the appropriate
// member that contains all project data and pass that to the actual selectors in model.ts

import {
  getIDs as modelGetIDs,
  getName as modelGetName,
  getProjects as modelGetProjects,
} from './model';

export const getIDs = (state: any) => modelGetIDs(state.entities.projects);
export const getName = (state: any, id: string) => modelGetName(state.entities.projects, id);
export const getProjects = (state: any) => modelGetProjects(state.entities.projects);
