import { Action } from 'redux';

import { FetchError } from '../errors';

// State
export interface ProjectUser {
  email: string;
  name?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  branches?: string[] | FetchError; // Undefined if they have not yet been fetched
  latestActivityTimestamp?: number;
  latestSuccessfullyDeployedCommit?: string;
  activeUsers: ProjectUser[];
  repoUrl: string;
}

export interface ProjectState {
  [id: string]: Project | FetchError;
};

// Actions
// LOAD_ALL_PROJECTS
export interface LoadAllProjectsAction extends Action {}

// LOAD_PROJECT
export interface LoadProjectAction extends Action {
  id: string;
}

// STORE_PROJECTS
export interface StoreProjectsAction extends Action {
  entities: Project[];
}

// ADD_BRANCHES_TO_PROJECT
export interface AddBranchesToProjectAction extends Action {
  id: string;
  branches: string[];
}

// CREATE_PROJECT
export interface CreateProjectAction extends Action {
  payload: {
    name: string;
    description?: string;
  };
}

// EDIT_PROJECT
export interface EditProjectAction extends Action {
  payload: {
    name: string;
    description?: string;
  };
}

// DELETE_PROJECT
export interface DeleteProjectAction extends Action {
  id: string;
  resolve: () => void;
  reject: () => void;
}

// UPDATE_PROJECT
export interface UpdateProjectAction extends Action {
  id: string;
  name: string;
  description?: string;
  repoUrl: string;
}

// REMOVE_PROJECT
export interface RemoveProjectAction extends Action {
  id: string;
}

// STORE_AUTHORS_TO_PROJECT
export interface StoreAuthorsToProjectAction extends Action {
  id: string;
  authors: ProjectUser[];
}

// UPDATE_LATEST_ACTIVITY_TIMESTAMP
export interface UpdateLatestActivityTimestampAction extends Action {
  id: string;
  timestamp: number;
}

// REMOVE_BRANCH
export interface RemoveBranchAction extends Action {
  id: string;
  branch: string;
}

export interface UpdateLatestDeployedCommitAction extends Action {
  id: string;
  commit: string;
}
