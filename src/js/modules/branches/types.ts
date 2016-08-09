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
export interface RequestBranchAction extends Action {
  id: string;
  error?: string;
  response?: ResponseBranchElement;
}

export interface RequestBranchActionCreators {
  request: ActionCreator<RequestBranchAction>;
  success: ActionCreator<RequestBranchAction>;
  failure: ActionCreator<RequestBranchAction>;
}

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
