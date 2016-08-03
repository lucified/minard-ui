import { Action, ActionCreator } from 'redux';

// State
export interface Project {
  id: string;
  name: string;
  description?: string;
  branches: string[];
  activeUsers: string[];
}

export interface ProjectState {
  [id: string]: Project;
};

// Actions
export interface RequestAllProjectsAction extends Action {
  error?: any;
  response?: ResponseProjectElement[];
}

// TODO: more specific types for these
export interface RequestAllProjectsActionCreators {
  request: ActionCreator<RequestAllProjectsAction>;
  success: ActionCreator<RequestAllProjectsAction>
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
  projects: ResponseProjectElement[];
}

// API response
interface ResponseBranchReference {
  type: "branches";
  id: string;
}

interface ResponseProjectElement {
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
