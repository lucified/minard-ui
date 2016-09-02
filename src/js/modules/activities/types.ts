import { Action } from 'redux';

import { FetchCollectionError } from '../errors';
import { RequestActionCreators } from '../types';

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
  branch: string;
  project: string;
}

export interface ActivityState {
  [id: string]: Activity;
};

// Actions
// ACTIVITIES
export interface LoadActivitiesAction extends Action {

}

export interface RequestActivitiesRequestAction extends Action {

}

export interface RequestActivitiesSuccessAction extends Action {
  response: ResponseActivityElement[];
}

export type RequestActivitiesActionCreators =
  RequestActionCreators<
    RequestActivitiesRequestAction,
    RequestActivitiesSuccessAction,
    FetchCollectionError
  >;

// ACTIVITIES_FOR_PROJECT
export interface LoadActivitiesForProjectAction extends Action {
  id: string;
}

export interface RequestActivitiesForProjectRequestAction extends Action {
  id: string;
}

export interface RequestActivitiesForProjectSuccessAction extends Action {
  id: string;
  response: ResponseActivityElement[];
}

export type RequestActivitiesForProjectActionCreators =
  RequestActionCreators<
    RequestActivitiesForProjectRequestAction,
    RequestActivitiesForProjectSuccessAction,
    FetchCollectionError
  >;

// STORE_PROJECTS
export interface StoreActivitiesAction extends Action {
  entities: ResponseActivityElement[];
}

// API response
interface ResponseDeploymentReference {
  type: "deployments";
  id: string;
}

interface ResponseBranchReference {
  type: "branches";
  id: string;
}

interface ResponseProjectReference {
  type: "projects";
  id: string;
}

export interface ResponseActivityElement {
  type: "activities";
  id: string;
  attributes: {
    'activity-type': 'deployment' | 'comment';
    timestamp: string;
  };
  relationships: {
    deployment: {
      data: ResponseDeploymentReference;
    };
    branch: {
      data: ResponseBranchReference;
    };
    project: {
      data: ResponseProjectReference;
    };
  };
}

export type ApiResponse = ResponseActivityElement[];
