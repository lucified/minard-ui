export type ApiEntityTypeString = "commits" | "deployments" | "projects" | "branches"

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
  fetchAllProjects: () => ApiPromise;
  fetchProject: (id: string) => ApiPromise;
  fetchDeployment: (id: string) => ApiPromise;
  fetchBranch: (id: string) => ApiPromise;
  fetchCommit: (id: string) => ApiPromise;
}
