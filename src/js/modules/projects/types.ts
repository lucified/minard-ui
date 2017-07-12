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
  token: string;
  webhookUrl?: string;
}

export interface ProjectState {
  [id: string]: Project | FetchError;
}

export interface LoadAllProjectsAction {
  type: 'PROJECTS/LOAD_ALL_PROJECTS';
  teamId: string;
}

export interface LoadProjectAction {
  type: 'PROJECTS/LOAD_PROJECT';
  id: string;
}

export interface FetchProjectAction {
  type: 'PROJECTS/FETCH_PROJECT';
  id: string;
}

export interface StoreProjectsAction {
  type: 'PROJECTS/STORE_PROJECTS';
  entities: Project[];
}

export interface AddBranchesToProjectAction {
  type: 'PROJECTS/ADD_BRANCHES_TO_PROJECT';
  id: string;
  branches: string[];
}

export interface CreateProjectFormData {
  teamId: string;
  name: string;
  description?: string;
  projectTemplate?: string;
}

export interface CreateProjectAction {
  type: 'PROJECTS/CREATE_PROJECT';
  payload: CreateProjectFormData;
}

export interface EditProjectFormData extends Project {}

export interface EditProjectAction {
  type: 'PROJECTS/EDIT_PROJECT';
  payload: EditProjectFormData;
}

export interface DeleteProjectAction {
  type: 'PROJECTS/DELETE_PROJECT';
  id: string;
  resolve: () => void;
  reject: () => void;
}

export interface UpdateProjectAction {
  type: 'PROJECTS/UPDATE_PROJECT';
  id: string;
  name: string;
  description?: string;
  repoUrl: string;
}

export interface RemoveProjectAction {
  type: 'PROJECTS/REMOVE_PROJECT';
  id: string;
}

export interface StoreAuthorsToProjectAction {
  type: 'PROJECTS/STORE_AUTHORS_TO_PROJECT';
  id: string;
  authors: ProjectUser[];
}

export interface UpdateLatestActivityTimestampAction {
  type: 'PROJECTS/UPDATE_LATEST_ACTIVITY_TIMESTAMP_FOR_PROJECT';
  id: string;
  timestamp: number;
}

export interface RemoveBranchAction {
  type: 'PROJECTS/REMOVE_BRANCH_FROM_PROJECT';
  id: string;
  branch: string;
}

export interface UpdateLatestDeployedCommitAction {
  type: 'PROJECTS/UPDATE_LATEST_DEPLOYED_COMMIT_FOR_PROJECT';
  id: string;
  commit: string;
}
