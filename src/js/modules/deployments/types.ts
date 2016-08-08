import { Action, ActionCreator } from 'redux';

import { FetchError } from '../errors';

// State
export interface Deployment {
  id: string;
  url: string;
  commit: string;
  creator: {
    name?: string;
    email: string;
    timestamp: number;
  };
  screenshot?: string;
}

export interface DeploymentState {
  [id: string]: Deployment | FetchError;
};

// Actions
export interface RequestDeploymentAction extends Action {
  id: string;
  error?: any;
  response?: ResponseDeploymentElement;
}

export interface RequestDeploymentActionCreators {
  request: ActionCreator<RequestDeploymentAction>;
  success: ActionCreator<RequestDeploymentAction>;
  failure: ActionCreator<RequestDeploymentAction>;
}

export interface StoreDeploymentsAction extends Action {
  entities: ResponseDeploymentElement[];
}

// API response
interface ResponseCommitReference {
  type: "commits";
  id: string;
}

export interface ResponseDeploymentElement {
  type: "deployments";
  id: string;
  attributes: {
    creator: {
      name?: string;
      email: string;
      timestamp: string;
    };
    url: string;
    screenshot?: string;
  };
  relationships: {
    commit: {
      data: ResponseCommitReference;
    };
  };
}

export type ApiResponse = ResponseDeploymentElement[];
