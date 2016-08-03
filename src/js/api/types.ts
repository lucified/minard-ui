export interface ApiEntity {
  type: "commits" | "deployments" | "projects" | "branches";
  id: string;
  attributes?: any;
  relationships?: any;
}

interface ApiResponse {
  data: ApiEntity | ApiEntity[];
  included?: ApiEntity[];
}

type ApiPromise = Promise<{ response: ApiResponse; } | { error: string; }>;

export interface Api {
  fetchProjects: () => ApiPromise;
  fetchProject: (id: string) => ApiPromise;
  fetchDeployment: (id: string) => ApiPromise;
  fetchBranch: (id: string) => ApiPromise;
}
