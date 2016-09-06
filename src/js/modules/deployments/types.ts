import { Action } from 'redux';

import { FetchError } from '../errors';
import { ApiUser, RequestFetchActionCreators, User } from '../types';

type DeploymentStatus = 'success' | 'failed' | 'running' | 'pending' | 'canceled';

export const isSuccessful = (deployment: Deployment) => deployment.status === 'success';
export const isPending = (deployment: Deployment) => deployment.status === 'pending' || deployment.status === 'running';
export const isFailed = (deployment: Deployment) => deployment.status === 'failed' || deployment.status === 'canceled';

// State
export interface Deployment {
  id: string;
  creator: User;
  url?: string;
  screenshot?: string;
  status: DeploymentStatus;
}

export interface DeploymentState {
  [id: string]: Deployment | FetchError;
};

// Actions
// LOAD_DEPLOYMENT
export interface LoadDeploymentAction extends Action {
  id: string;
}
export type RequestDeploymentActionCreators = RequestFetchActionCreators<ResponseDeploymentElement>;

// STORE_DEPLOYMENTS
export interface StoreDeploymentsAction extends Action {
  entities: ResponseDeploymentElement[];
}

// API response
export interface ResponseDeploymentElement {
  type: "deployments";
  id: string;
  attributes: {
    creator: ApiUser;
    url?: string;
    screenshot?: string;
    status: DeploymentStatus;
  };
}

export type ApiResponse = ResponseDeploymentElement[];
