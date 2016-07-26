export interface Branch {
  id: string;
  name: string;
  description?: string;
}

export interface BranchState {
  [id: string]: Branch;
};
