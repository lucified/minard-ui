import { Action } from 'redux';

import { DeploymentStatus } from '../deployments';

// State
export enum ActivityType {
  Comment,
  Deployment,
};

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

// ACTIVITIES_FOR_PROJECT
export interface LoadActivitiesForProjectAction extends Action {
  id: string;
}

// STORE_PROJECTS
export interface StoreActivitiesAction extends Action {
  entities: Activity[];
}
