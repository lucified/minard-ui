import { Action } from 'redux';

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

export interface ProjectsRequestActionObject {
  request: () => Action;
  success: (response: any) => Action;
  failure: (error: any) => Action;
}

export interface LoadProjectsAction extends Action {
  error?: any;
  response?: any;
}

interface BranchReference {
  id: string;
  type: "branches";
}

interface ProjectElement {
  type: "projects";
  id: string;
  attributes: {
    name: string;
    description: string;
  };
  relationships: {
    branches: {
      data: BranchReference[];
    };
  };
}

export interface ApiResponse {
  data: ProjectElement[];
}
