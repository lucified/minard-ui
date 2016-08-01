import { Action, ActionCreator } from 'redux';

// State
export interface Branch {
  id: string;
  name: string;
  project: string;
  description?: string;
  commits: string[];
  deployments: string[];
}

export interface BranchState {
  [id: string]: Branch;
};

// Actions
export interface LoadBranchAction extends Action {
  id: string;
  projectId: string;
  error?: any;
  response?: ResponseBranchElement;
}

export interface BranchesRequestActionCreators {
  request: ActionCreator<LoadBranchAction>;
  success: ActionCreator<LoadBranchAction>;
  failure: ActionCreator<LoadBranchAction>;
}

export interface StoreBranchesAction extends Action {
  branches: ResponseBranchElement[];
}

// API response
interface ResponseDeploymentReference {
  type: "deployments";
  id: string;
}

interface ResponseCommitReference {
  type: "commits";
  id: string;
}

interface ResponseProjectReference {
  type: "projects";
  id: string;
}

interface ResponseBranchElement {
  type: "branches";
  id: string;
  attributes: {
    name: string;
    description?: string;
  };
  relationships: {
    deployments: {
      data: ResponseDeploymentReference[];
    };
    commits: {
      data: ResponseCommitReference[];
    };
    project: {
      data: ResponseProjectReference;
    }
  };
}

export type ApiResponse = ResponseBranchElement[];
