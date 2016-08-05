import { Action, ActionCreator } from 'redux';

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
  [id: string]: Deployment;
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
  deployments: ResponseDeploymentElement[];
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
