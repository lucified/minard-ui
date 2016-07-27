export interface Branch {
  id: string;
  name: string;
  project: string;
  description?: string;
  commits: string[];
}

export interface BranchState {
  [id: string]: Branch;
};
