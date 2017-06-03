import { FetchError } from '../errors';
import { User } from '../types';

export enum DeploymentStatus {
  Success,
  Failed,
  Running,
  Pending,
  Canceled,
}

export function toDeploymentStatus(deploymentStatus: string): DeploymentStatus {
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
}

export const isSuccessful = (deployment: Deployment) =>
  deployment.status === DeploymentStatus.Success;
export const isPending = (deployment: Deployment) =>
  deployment.status === DeploymentStatus.Pending ||
  deployment.status === DeploymentStatus.Running;
export const isFailed = (deployment: Deployment) =>
  deployment.status === DeploymentStatus.Failed ||
  deployment.status === DeploymentStatus.Canceled;

// State
export interface Deployment {
  id: string;
  creator: User;
  url?: string;
  screenshot?: string;
  status: DeploymentStatus;
  comments?: string[] | FetchError;
  commentCount?: number;
  token: string;
}

export interface DeploymentState {
  [id: string]: Deployment | FetchError;
}

// Actions
export interface LoadDeploymentAction {
  type: 'DEPLOYMENTS/LOAD_DEPLOYMENT';
  id: string;
}

export interface FetchDeploymentAction {
  type: 'DEPLOYMENTS/FETCH_DEPLOYMENT';
  id: string;
}

export interface StoreDeploymentsAction {
  type: 'DEPLOYMENTS/STORE_DEPLOYMENTS';
  entities: Deployment[];
}

export interface AddCommentsToDeploymentAction {
  type: 'DEPLOYMENTS/ADD_COMMENTS_TO_DEPLOYMENT';
  id: string;
  comments: string[];
}

export interface SetCommentsForDeploymentAction {
  type: 'DEPLOYMENTS/SET_COMMENTS_FOR_DEPLOYMENT';
  id: string;
  comments: string[];
}

export interface RemoveCommentFromDeploymentAction {
  type: 'DEPLOYMENTS/REMOVE_COMMENT_FROM_DEPLOYMENT';
  id: string;
  comment: string;
}
