import { Action } from 'redux';

import { FetchError } from '../errors';
import {
  ApiUser,
  RequestCreateActionCreators,
  RequestDeleteActionCreators,
  RequestEditActionCreators,
  RequestFetchActionCreators,
  RequestFetchCollectionActionCreators,
  User,
} from '../types';

// State
export interface Project {
  id: string;
  name: string;
  description?: string;
  branches?: string[]; // Undefined if they have not yet been fetched
  latestActivityTimestamp?: number;
  latestSuccessfullyDeployedCommit?: string;
  activeUsers: User[];
}

export interface ProjectState {
  [id: string]: Project | FetchError;
};

// Actions
// LOAD_ALL_PROJECTS
export interface LoadAllProjectsAction extends Action {}
export type RequestAllProjectsActionCreators = RequestFetchCollectionActionCreators<ResponseProjectElement[]>;

// LOAD_PROJECT
export interface LoadProjectAction extends Action {
  id: string;
}
export type RequestProjectActionCreators = RequestFetchActionCreators<ResponseProjectElement>;

// STORE_PROJECTS
export interface StoreProjectsAction extends Action {
  entities: ResponseProjectElement[];
}

// CREATE_PROJECT
export type SendCreateProjectActionCreators = RequestCreateActionCreators;

// EDIT_PROJECT
export type SendEditProjectActionCreators = RequestEditActionCreators;

// DELETE_PROJECT
export interface DeleteProjectAction extends Action {
  id: string;
  resolve: () => void;
  reject: () => void;
}
export type SendDeleteProjectActionCreators = RequestDeleteActionCreators;

// API response
interface ResponseCommitReference {
  type: "commit";
  id: string;
}

export interface ResponseProjectElement {
  type: "projects";
  id: string;
  attributes: {
    name: string;
    description?: string;
    'active-committers': ApiUser[];
    'latest-activity-timestamp'?: string;
  };
  relationships?: {
    'latest-successfully-deployed-commit'?: {
      data?: ResponseCommitReference;
    };
  };
}

export type ApiResponse = ResponseProjectElement[];
