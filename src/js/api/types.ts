export type ApiEntityTypeString = "commits" | "deployments" | "projects" | "branches" | "activities";

export interface ApiEntity {
  type: ApiEntityTypeString;
  id: string;
  attributes?: any;
  relationships?: any;
}

export interface ApiResponse {
  data: ApiEntity | ApiEntity[];
  included?: ApiEntity[];
}

export type ApiPromise = Promise<{ response: ApiResponse; } | { error: string; }>;

export interface Api {
  fetchActivities: () => ApiPromise;
  fetchActivitiesForProject: (id: string) => ApiPromise;
  fetchAllProjects: () => ApiPromise;
  fetchProject: (id: string) => ApiPromise;
  fetchDeployment: (id: string) => ApiPromise;
  fetchBranch: (id: string) => ApiPromise;
  fetchCommit: (id: string) => ApiPromise;
}
