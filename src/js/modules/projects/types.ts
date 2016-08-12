import { Action } from 'redux';

import { FetchError } from '../errors';
import { ApiUser, RequestActionCreators, User } from '../types';

// State
export interface Project {
  id: string;
  name: string;
  description?: string;
  branches: string[];
  activeUsers: User[];
}

export interface ProjectState {
  [id: string]: Project | FetchError;
};

// Actions
// LOAD_ALL_PROJECTS
export interface LoadAllProjectsAction extends Action {

}

// ALL_PROJECTS
export interface RequestAllProjectsRequestAction extends Action {

}

export interface RequestAllProjectsSuccessAction extends Action {
  response: ResponseProjectElement[];
}

export type RequestAllProjectsActionCreators =
  RequestActionCreators<RequestAllProjectsRequestAction, RequestAllProjectsSuccessAction, FetchError>;

// LOAD_PROJECT
export interface LoadProjectAction extends Action {
  id: string;
}

// PROJECT
export interface RequestProjectRequestAction extends Action {
  id: string;
}

export interface RequestProjectSuccessAction extends Action {
  id: string;
  response: ResponseProjectElement;
}

export type RequestProjectActionCreators =
  RequestActionCreators<RequestProjectRequestAction, RequestProjectSuccessAction, FetchError>;

// STORE_PROJECTS
export interface StoreProjectsAction extends Action {
  entities: ResponseProjectElement[];
}

// API response
interface ResponseBranchReference {
  type: "branches";
  id: string;
}

export interface ResponseProjectElement {
  type: "projects";
  id: string;
  attributes: {
    name: string;
    description?: string;
    'active-committers': ApiUser[];
  };
  relationships: {
    branches: {
      data: ResponseBranchReference[];
    };
  };
}

export type ApiResponse = ResponseProjectElement[];
