import { Action } from 'redux';

import { FetchError } from '../errors';
import { ApiUser, RequestFetchActionCreators, User } from '../types';

export type DeploymentStatusString = 'success' | 'failed' | 'running' | 'pending' | 'canceled';
export enum DeploymentStatus {
  Success,
  Failed,
  Running,
  Pending,
  Canceled,
};

export const toDeploymentStatus = (deploymentStatus: string): DeploymentStatus => {
  switch (deploymentStatus) {
    case 'success':
      return DeploymentStatus.Success;
    case 'failed':
      return DeploymentStatus.Failed;
    case 'running':
      return DeploymentStatus.Running;
    case 'pending':
      return DeploymentStatus.Pending;
    case 'canceled':
      return DeploymentStatus.Canceled;
    default:
      throw new Error(`Unknown deployment type ${deploymentStatus}!`);
  }
};

export const isSuccessful = (deployment: Deployment) =>
  deployment.status === DeploymentStatus.Success;
export const isPending = (deployment: Deployment) =>
  deployment.status === DeploymentStatus.Pending || deployment.status === DeploymentStatus.Running;
export const isFailed = (deployment: Deployment) =>
  deployment.status === DeploymentStatus.Failed || deployment.status === DeploymentStatus.Canceled;

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
    status: DeploymentStatusString;
  };
}

export type ApiResponse = ResponseDeploymentElement[];
