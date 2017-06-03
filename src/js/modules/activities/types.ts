import { DeploymentStatus } from '../deployments';

// State
export enum ActivityType {
  Comment,
  Deployment,
}

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
    token: string;
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
}

// Actions
export interface LoadActivitiesAction {
  type: 'ACTIVITIES/LOAD_ACTIVITIES';
  teamId: string;
  count: number;
  until?: number;
}

export interface LoadActivitiesForProjectAction {
  type: 'ACTIVITIES/LOAD_ACTIVITIES_FOR_PROJECT';
  id: string;
  count: number;
  until?: number;
}

export interface StoreActivitiesAction {
  type: 'ACTIVITIES/STORE_ACTIVITIES';
  entities: Activity[];
}
