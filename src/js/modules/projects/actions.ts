import {
  AddBranchesToProjectAction,
  FetchProjectAction,
  LoadAllProjectsAction,
  LoadProjectAction,
  Project,
  ProjectUser,
  RemoveBranchAction,
  RemoveProjectAction,
  StoreAuthorsToProjectAction,
  StoreProjectsAction,
  UpdateLatestActivityTimestampAction,
  UpdateLatestDeployedCommitAction,
  UpdateProjectAction,
} from './types';

// Load multiple projects
export const LOAD_ALL_PROJECTS = 'PROJECTS/LOAD_ALL_PROJECTS';
export const loadAllProjects = (teamId: string): LoadAllProjectsAction => ({
  type: LOAD_ALL_PROJECTS,
  teamId,
});

// Load a single project
export const LOAD_PROJECT = 'PROJECTS/LOAD_PROJECT';
export const loadProject = (id: string): LoadProjectAction => ({
  type: LOAD_PROJECT,
  id,
});

// Only fetch (don't ensure related data) a single project
export const FETCH_PROJECT = 'PROJECTS/FETCH_PROJECT';
export const fetchProject = (id: string): FetchProjectAction => ({
  type: FETCH_PROJECT,
  id,
});

// Store included projects
export const STORE_PROJECTS = 'PROJECTS/STORE_PROJECTS';
export const storeProjects = (projects: Project[]): StoreProjectsAction => ({
  type: STORE_PROJECTS,
  entities: projects,
});

// Add branches to existing project
export const ADD_BRANCHES_TO_PROJECT = 'PROJECTS/ADD_BRANCHES_TO_PROJECT';
export const addBranchesToProject = (
  id: string,
  branchIds: string[] | string,
): AddBranchesToProjectAction => {
  const branches: string[] =
    typeof branchIds === 'string' ? [branchIds] : branchIds;

  return {
    type: ADD_BRANCHES_TO_PROJECT,
    id,
    branches,
  };
};

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
  reject: () => void,
) => ({
  type: DELETE_PROJECT,
  id,
  resolve,
  reject,
});

// Update project based on event from Streaming API
export const UPDATE_PROJECT = 'PROJECTS/UPDATE_PROJECT';
export const updateProject = (
  id: string,
  name: string,
  repoUrl: string,
  description?: string,
): UpdateProjectAction => ({
  type: UPDATE_PROJECT,
  id,
  name,
  repoUrl,
  description,
});

// Remove project based on event from Streaming API
export const REMOVE_PROJECT = 'PROJECTS/REMOVE_PROJECT';
export const removeProject = (id: string): RemoveProjectAction => ({
  type: REMOVE_PROJECT,
  id,
});

// Add users to project based on code pushes from Streaming API
export const STORE_AUTHORS_TO_PROJECT = 'PROJECTS/STORE_AUTHORS_TO_PROJECT';
export const storeAuthorsToProject = (
  id: string,
  authors: ProjectUser[],
): StoreAuthorsToProjectAction => ({
  type: STORE_AUTHORS_TO_PROJECT,
  id,
  authors,
});

export const UPDATE_LATEST_ACTIVITY_TIMESTAMP_FOR_PROJECT =
  'PROJECTS/UPDATE_LATEST_ACTIVITY_TIMESTAMP_FOR_PROJECT';
export const updateLatestActivityTimestampForProject = (
  id: string,
  timestamp: number,
): UpdateLatestActivityTimestampAction => ({
  type: UPDATE_LATEST_ACTIVITY_TIMESTAMP_FOR_PROJECT,
  id,
  timestamp,
});

export const REMOVE_BRANCH_FROM_PROJECT = 'PROJECTS/REMOVE_BRANCH_FROM_PROJECT';
export const removeBranchFromProject = (
  id: string,
  branch: string,
): RemoveBranchAction => ({
  type: REMOVE_BRANCH_FROM_PROJECT,
  id,
  branch,
});

export const UPDATE_LATEST_DEPLOYED_COMMIT_FOR_PROJECT =
  'PROJECTS/UPDATE_LATEST_DEPLOYED_COMMIT_FOR_PROJECT';
export const updateLatestDeployedCommitForProject = (
  id: string,
  commit: string,
): UpdateLatestDeployedCommitAction => ({
  type: UPDATE_LATEST_DEPLOYED_COMMIT_FOR_PROJECT,
  id,
  commit,
});
