import { Action, ActionCreator } from 'redux';

import { FetchError } from '../errors';

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
  [id: string]: Branch | FetchError;
};

// Actions
// BRANCH
export interface RequestBranchRequestAction extends Action {
  id: string;
}

export interface RequestBranchSuccessAction extends Action {
  id: string;
  response: ResponseBranchElement;
}

export interface RequestBranchActionCreators {
  request: ActionCreator<RequestBranchRequestAction>;
  success: ActionCreator<RequestBranchSuccessAction>;
  failure: ActionCreator<FetchError>;
}

// STORE_BRANCHES
export interface StoreBranchesAction extends Action {
  entities: ResponseBranchElement[];
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

export interface ResponseBranchElement {
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
