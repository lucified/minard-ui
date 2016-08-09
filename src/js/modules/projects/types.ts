import { Action, ActionCreator } from 'redux';

import { FetchError } from '../errors';

// State
export interface Project {
  id: string;
  name: string;
  description?: string;
  branches: string[];
  activeUsers: string[];
}

export interface ProjectState {
  [id: string]: Project | FetchError;
};

// Actions
export interface RequestAllProjectsAction extends Action {
  error?: string;
  response?: ResponseProjectElement[];
}

// TODO: more specific types for these
export interface RequestAllProjectsActionCreators {
  request: ActionCreator<RequestAllProjectsAction>;
  success: ActionCreator<RequestAllProjectsAction>;
  failure: ActionCreator<RequestAllProjectsAction>;
}

export interface RequestProjectAction extends Action {
  id: string;
  error?: string;
  response?: ResponseProjectElement;
}

export interface RequestProjectActionCreators {
  request: ActionCreator<RequestProjectAction>;
  success: ActionCreator<RequestProjectAction>;
  failure: ActionCreator<RequestProjectAction>;
}

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
    activeCommiters: string[];
  };
  relationships: {
    branches: {
      data: ResponseBranchReference[];
    };
  };
}

export type ApiResponse = ResponseProjectElement[];
