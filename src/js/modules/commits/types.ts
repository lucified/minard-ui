export interface Commit {
  hash: string;
  branchId: string;
  timestamp: number;
  message: string;
  author: string;
  description?: string;
  hasDeployment: boolean;
  deployment?: string;
  screenshot?: string;
}

export interface CommitState {
  [id: string]: Commit;
};
