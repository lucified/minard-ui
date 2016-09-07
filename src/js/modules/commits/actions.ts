import { createRequestTypes, prettyErrorMessage } from '../common';
import * as t from './types';

export const LOAD_COMMIT = 'COMMITS/LOAD_COMMIT';
export const loadCOMMIT = (id: string): t.LoadCommitAction => ({
  type: LOAD_COMMIT,
  id,
});

export const COMMIT = createRequestTypes('COMMITS/COMMIT');
export const FetchCommit: t.RequestCommitActionCreators = {
  request: (id) => ({ type: COMMIT.REQUEST, id }),
  success: (id, response) => ({ type: COMMIT.SUCCESS, id, response }),
  failure: (id, error, details) => ({
    type: COMMIT.FAILURE,
    id,
    error,
    details,
    prettyError: prettyErrorMessage(error),
  }),
};

export const LOAD_COMMITS_FOR_BRANCH = 'COMMITS/LOAD_COMMITS_FOR_BRANCH';
export const loadCommitsForBranch = (id: string): t.LoadCommitsForBranchAction => ({
  type: LOAD_COMMITS_FOR_BRANCH,
  id,
});

export const COMMITS_FOR_BRANCH = createRequestTypes('COMMITS/COMMITS_FOR_BRANCH');
export const FetchCommitsForBranch: t.RequestCommitsForBranchActionCreators = {
  request: (id) => ({ type: COMMITS_FOR_BRANCH.REQUEST, id }),
  success: (id, response) => ({ type: COMMITS_FOR_BRANCH.SUCCESS, id, response }),
  failure: (id, error, details) => ({
    type: COMMITS_FOR_BRANCH.FAILURE,
    id,
    error,
    details,
    prettyError: prettyErrorMessage(error),
  }),
};

export const STORE_COMMITS = 'COMMITS/STORE_COMMITS';
export const storeCommits = (commits: t.ResponseCommitElement[]): t.StoreCommitsAction => ({
  type: STORE_COMMITS,
  entities: commits,
});
