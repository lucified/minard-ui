import { Action } from 'redux';

import { FetchError } from '../errors';
import { RequestFetchActionCreators } from '../types';

// State
export interface Branch {
  id: string;
  name: string;
  project: string;
  description?: string;
  commits?: string[]; // If undefined, we have not fetched the relationship data yet
  latestSuccessfullyDeployedCommit?: string;
  latestCommit?: string;
  minardJson?: {
    errors?: string[];
  };
}

export interface BranchState {
  [id: string]: Branch | FetchError;
};

// Actions
// LOAD_BRANCH
export interface LoadBranchAction extends Action {
  id: string;
}
export type RequestBranchActionCreators = RequestFetchActionCreators<ResponseBranchElement>;

// STORE_BRANCHES
export interface StoreBranchesAction extends Action {
  entities: ResponseBranchElement[];
}

// API response
interface ResponseCommitReference {
  type: "commits";
  id: string;
}

interface ResponseProjectReference {
  type: "projects";
  id: string;
}

export interface ResponseBranchElement {
  type: "branches";
  id: string;
  attributes: {
    name: string;
    description?: string;
    'minard-json'?: {
      errors?: string[];
    };
  };
  relationships: {
    'latest-successfully-deployed-commit'?: {
      data?: ResponseCommitReference;
    };
    'latest-commit'?: {
      data?: ResponseCommitReference;
    };
    project: {
      data: ResponseProjectReference;
    }
  };
}

export type ApiResponse = ResponseBranchElement[];
