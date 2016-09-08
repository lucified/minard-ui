import { Action } from 'redux';

import { RequestFetchCollectionActionCreators, RequestFetchSpecificCollectionActionCreators } from '../types';

// State
export enum ActivityType {
  Comment,
  Deployment,
};

type DeploymentStatus = 'success' | 'failed' | 'running' | 'pending' | 'canceled';

export interface Activity {
  id: string;
  type: ActivityType;
  timestamp: number;
  commit: {
    id: string;
    hash: string;
    message: string;
    author: {
      name?: string;
      email: string;
      timestamp: number;
    };
    committer: {
      name?: string;
      email: string;
      timestamp: number;
    };
    deployment?: string;
  };
  branch: {
    id: string;
    name: string;
  };
  project: {
    id: string;
    name: string;
  };
  deployment: {
    status: DeploymentStatus;
    id: string;
    url?: string;
    screenshot?: string;
    creator: {
      name?: string;
      email: string;
      timestamp: number;
    };
  };
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
interface ResponseCommitReference {
  type: "commits";
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
    project: {
      id: string;
      name: string;
    };
    branch: {
      id: string;
      name: string;
    };
    commit: {
      id: string;
      hash: string;
      message: string;
      author: {
        name?: string;
        email: string;
        timestamp: string;
      };
      committer: {
        name?: string;
        email: string;
        timestamp: string;
      };
      deployments: string[];
    };
    deployment: {
      status: DeploymentStatus;
      id: string;
      url?: string;
      screenshot?: string;
      creator: {
        name?: string;
        email: string;
        timestamp: string;
      };
    };
  };
}

export type ApiResponse = ResponseActivityElement[];
