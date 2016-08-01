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
export interface LoadAllProjectsAction extends Action {
  error?: any;
  response?: ResponseProjectElement[];
}

export interface FetchProjectsActionCreators {
  request: ActionCreator<LoadAllProjectsAction>;
  success: ActionCreator<LoadAllProjectsAction>;
  failure: ActionCreator<LoadAllProjectsAction>;
}

export interface LoadProjectAction extends Action {
  id: string;
  error?: string;
  response?: ResponseProjectElement;
}

export interface FetchProjectActionCreators {
  request: ActionCreator<LoadProjectAction>;
  success: ActionCreator<LoadProjectAction>;
  failure: ActionCreator<LoadProjectAction>;
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
