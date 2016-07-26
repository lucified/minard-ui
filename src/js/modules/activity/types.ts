export enum ActivityType {
  Comment,
  Deployment,
};

export interface Activity {
  id: string;
  project: string;
  branch: string;
  type: ActivityType;
  timestamp: number;
  author: string;
  deployment: string;
  comment?: string;
  commitMessage?: string;
}

export interface ActivityState {
  [id: string]: Activity;
};
