import { Action } from 'redux';

import { RequestFetchCollectionActionCreators, RequestFetchSpecificCollectionActionCreators } from '../types';

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
export type RequestActivitiesActionCreators =
  RequestFetchCollectionActionCreators<ResponseActivityElement[]>;

// ACTIVITIES_FOR_PROJECT
export interface LoadActivitiesForProjectAction extends Action {
  id: string;
}
export type RequestActivitiesForProjectActionCreators =
  RequestFetchSpecificCollectionActionCreators<ResponseActivityElement[]>;

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
