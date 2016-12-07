import { Action } from 'redux';

import { FetchError } from '../errors';
import { User } from '../types';

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
  comments?: string[] | FetchError;
}

export interface DeploymentState {
  [id: string]: Deployment | FetchError;
};

// Actions
// LOAD_DEPLOYMENT
export interface LoadDeploymentAction extends Action {
  id: string;
}

// STORE_DEPLOYMENTS
export interface StoreDeploymentsAction extends Action {
  entities: Deployment[];
}

// ADD_COMMENTS_TO_DEPLOYMENT
export interface AddCommentsToDeploymentAction extends Action {
  id: string;
  comments: string[];
}

// SET_COMMENTS_FOR_DEPLOYMENT
export interface SetCommentsForDeploymentAction extends Action {
  id: string;
  comments: string[];
}

export interface RemoveCommentFromDeploymentAction extends Action {
  id: string;
  comment: string;
}
