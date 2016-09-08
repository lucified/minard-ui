import * as t from './types';

// Load multiple projects
export const LOAD_ALL_PROJECTS = 'PROJECTS/LOAD_ALL_PROJECTS';
export const loadAllProjects = (): t.LoadAllProjectsAction => ({
  type: LOAD_ALL_PROJECTS,
});

// Load a single project
export const LOAD_PROJECT = 'PROJECTS/LOAD_PROJECT';
export const loadProject = (id: string): t.LoadProjectAction => ({
  type: LOAD_PROJECT,
  id,
});

// Store included projects
export const STORE_PROJECTS = 'PROJECTS/STORE_PROJECTS';
export const storeProjects = (projects: t.Project[]): t.StoreProjectsAction => ({
  type: STORE_PROJECTS,
  entities: projects,
});

// Add branches to existing project
export const ADD_BRANCHES_TO_PROJECT = 'PROJECTS/ADD_BRANCHES_TO_PROJECT';
export const addBranchesToProject = (id: string, branchIds: string[]): t.AddBranchesToProjectAction => ({
  type: ADD_BRANCHES_TO_PROJECT,
  id,
  branches: branchIds,
});

// Create a new project
// Action creators are handled by redux-form
export const CREATE_PROJECT = 'PROJECTS/CREATE_PROJECT';

// Edit an existing project
// Action creators are handled by redux-form
export const EDIT_PROJECT = 'PROJECTS/EDIT_PROJECT';

// Delete an existing project
export const DELETE_PROJECT = 'PROJECTS/DELETE_PROJECT';
export const deleteProjectPromiseResolver = (
  id: string,
  resolve: () => void,
  reject: () => void
) => ({
  type: DELETE_PROJECT,
  id,
  resolve,
  reject,
});
