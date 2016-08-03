export interface ApiEntity {
  type: "commits" | "deployments" | "projects" | "branches";
  id: string;
  attributes?: any;
  relationships?: any;
}

export interface ApiResponse {
  data: ApiEntity | ApiEntity[];
  included?: ApiEntity[];
}

export interface Api {
  fetchProjects: () => Promise<{ response: ApiResponse; } | { error: string; }>;
  fetchProject: (id: string) => Promise<{ response: ApiResponse; } | { error: string; }>;
  fetchDeployment: (id: string) => Promise<{ response: ApiResponse; } | { error: string; }>;
  fetchBranch: (id: string) => Promise<{ response: ApiResponse; } | { error: string; }>;
}
