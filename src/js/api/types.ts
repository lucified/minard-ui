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

export type ApiPromise = Promise<{ response: ApiResponse; } | { error: string; details?: string; }>;

export interface Api {
  Project: {
    fetchAll: () => ApiPromise;
    fetch: (id: string) => ApiPromise;
    create: (name: string, description?: string) => ApiPromise;
    edit: (id: string, newAttributes: { description?: string, name?: string }) => ApiPromise;
    delete: (id: string) => ApiPromise;
  };
  Activity: {
    fetchAll: () => ApiPromise;
    fetchAllForProject: (id: string) => ApiPromise;
  };
  Deployment: {
    fetch: (id: string) => ApiPromise;
  };
  Branch: {
    fetch: (id: string) => ApiPromise;
    fetchForProject: (id: string) => ApiPromise;
  };
  Commit: {
    fetch: (id: string) => ApiPromise;
    fetchForBranch: (id: string) => ApiPromise;
  };
}
