import { Action } from 'redux';

import { FetchError } from '../errors';
import { RequestFetchActionCreators, RequestFetchSpecificCollectionActionCreators } from '../types';

// State
export interface Branch {
  id: string;
  name: string;
  project: string;
  description?: string;
  commits: string[];
  latestSuccessfullyDeployedCommit?: string;
  latestCommit?: string;
  latestActivityTimestamp?: number;
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

// LOAD_BRANCHES_FOR_PROJECT
export interface LoadBranchesForProjectAction extends Action {
  id: string;
}
export type RequestBranchesForProjectActionCreators =
  RequestFetchSpecificCollectionActionCreators<ResponseBranchElement[]>;

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
    'latest-activity-timestamp'?: string;
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
