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
// LOAD_DEPLOYMENT
export interface LoadDeploymentAction extends Action {
  id: string;
}

// DEPLOYMENT
export interface RequestDeploymentRequestAction extends Action {
  id: string;
}

export interface RequestDeploymentSuccessAction extends Action {
  id: string;
  response: ResponseDeploymentElement;
}

export interface RequestDeploymentActionCreators {
  request: ActionCreator<RequestDeploymentRequestAction>;
  success: ActionCreator<RequestDeploymentSuccessAction>;
  failure: ActionCreator<FetchError>;
}

// STORE_DEPLOYMENTS
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
