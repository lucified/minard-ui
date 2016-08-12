import { Action, ActionCreator } from 'redux';

import { ApiUser, User } from '../common';
import { FetchError } from '../errors';

// State
export interface Deployment {
  id: string;
  commit: string;
  creator: User;
  url?: string;
  screenshot?: string;
  status: 'success' | 'failed' | 'running';
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
    creator: ApiUser;
    url?: string;
    screenshot?: string;
    status: 'success' | 'failed' | 'running';
  };
  relationships: {
    commit: {
      data: ResponseCommitReference;
    };
  };
}

export type ApiResponse = ResponseDeploymentElement[];
