import { ActionCreator } from 'redux';

import { createRequestTypes, prettyErrorMessage } from '../common';
import * as t from './types';

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

export const LOAD_COMMIT = 'COMMITS/LOAD_COMMIT';
export const loadCOMMIT: ActionCreator<t.LoadCommitAction> = (id) => ({
  type: LOAD_COMMIT,
  id,
});

export const STORE_COMMITS = 'COMMITS/STORE_COMMITS';
export const storeCommits: ActionCreator<t.StoreCommitsAction> = (commits) => ({
  type: STORE_COMMITS,
  entities: commits,
});
