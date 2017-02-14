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
    comments?: string[];
    creator: {
      name?: string;
      email: string;
      timestamp: number;
    };
  };
  commit: {
    id: string;
    hash: string;
    message: string;
    description?: string;
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
  comment?: {
    id: string;
    message: string;
    name?: string;
    email: string;
  };
}

export interface ActivityState {
  [id: string]: Activity;
};

// Actions
// ACTIVITIES
export interface LoadActivitiesAction extends Action {
  teamId: string;
  count: number;
  until?: number;
}

// ACTIVITIES_FOR_PROJECT
export interface LoadActivitiesForProjectAction extends Action {
  id: string;
  count: number;
  until?: number;
}

// STORE_PROJECTS
export interface StoreActivitiesAction extends Action {
  entities: Activity[];
}
