import { Action, ActionCreator } from 'redux';

import { ApiUser, User } from '../common';
import { FetchError } from '../errors';

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

export interface RequestAllProjectsActionCreators {
  request: ActionCreator<RequestAllProjectsRequestAction>;
  success: ActionCreator<RequestAllProjectsSuccessAction>;
  failure: ActionCreator<FetchError>;
}

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

export interface RequestProjectActionCreators {
  request: ActionCreator<RequestProjectRequestAction>;
  success: ActionCreator<RequestProjectSuccessAction>;
  failure: ActionCreator<FetchError>;
}

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
    activeCommiters: ApiUser[];
  };
  relationships: {
    branches: {
      data: ResponseBranchReference[];
    };
  };
}

export type ApiResponse = ResponseProjectElement[];
