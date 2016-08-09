import { Action, ActionCreator } from 'redux';

import { FetchError } from '../errors';

// State
export enum ActivityType {
  Comment,
  Deployment,
};

export interface Activity {
  id: string;
  type: ActivityType;
  timestamp: number;
  deployment: string;
}

export interface ActivityState {
  [id: string]: Activity;
};

// Actions
export interface LoadActivitiesAction extends Action {

}

export interface RequestActivitiesRequestAction extends Action {

}

export interface RequestActivitiesSuccessAction extends Action {
  response: ResponseActivityElement[];
}

export interface RequestActivitiesActionCreators {
  request: ActionCreator<RequestActivitiesRequestAction>;
  success: ActionCreator<RequestActivitiesSuccessAction>;
  failure: ActionCreator<FetchError>;
}

// STORE_PROJECTS
export interface StoreActivitiesAction extends Action {
  entities: ResponseActivityElement[];
}

// API response
interface ResponseDeploymentReference {
  type: "deployments";
  id: string;
}

export interface ResponseActivityElement {
  type: "activities";
  id: string;
  attributes: {
    activityType: string;
    timestamp: string;
  };
  relationships: {
    deployment: {
      data: ResponseDeploymentReference;
    };
  };
}

export type ApiResponse = ResponseActivityElement[];
