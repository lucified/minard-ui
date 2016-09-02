import { Action } from 'redux';

import { CreateError, DeleteError, EditError, FetchCollectionError, FetchError } from '../errors';
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
  RequestActionCreators<
    RequestAllProjectsRequestAction,
    RequestAllProjectsSuccessAction,
    FetchCollectionError
  >;

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

// CREATE_PROJECT
export interface CreateProjectAction extends Action {
  name: string;
  description?: string;
}

// SEND_CREATE_PROJECT
export interface SendCreateProjectRequestAction extends Action {
  name: string;
  description?: string;
}

export interface SendCreateProjectSuccessAction extends Action {
  id: string;
}

export type SendCreateProjectActionCreators =
  RequestActionCreators<
    SendCreateProjectRequestAction,
    SendCreateProjectSuccessAction,
    CreateError
  >;

// EDIT_PROJECT
export interface EditProjectAction extends Action {
  id: string;
  name: string;
  description: string;
}

// SEND_EDIT_PROJECT
export interface SendEditProjectRequestAction extends Action {
  id: string;
  newAttributes: {
    name: string;
    description: string;
  };
}

export interface SendEditProjectSuccessAction extends Action {
  id: string;
}

export type SendEditProjectActionCreators =
  RequestActionCreators<
    SendEditProjectRequestAction,
    SendEditProjectSuccessAction,
    EditError
  >;

// DELETE_PROJECT
export interface DeleteProjectAction extends Action {
  id: string;
  resolve: () => void;
  reject: () => void;
}

// SEND_DELETE_PROJECT
export interface SendDeleteProjectRequestAction extends Action {
  id: string;
}

export interface SendDeleteProjectSuccessAction extends Action {
  id: string;
}

export type SendDeleteProjectActionCreators =
  RequestActionCreators<SendDeleteProjectRequestAction, SendDeleteProjectSuccessAction, DeleteError>;

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
