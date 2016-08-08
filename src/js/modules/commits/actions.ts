import { ActionCreator } from 'redux';

import { createRequestTypes } from '../common';
import * as t from './types';

export const COMMIT = createRequestTypes('COMMITS/COMMIT');
export const FetchCommit: t.RequestCommitActionCreators = {
  request: (id) => ({ type: COMMIT.REQUEST, id }),
  success: (id, response) => ({ type: COMMIT.SUCCESS, id, response }),
  failure: (id, error) => ({ type: COMMIT.FAILURE, id, error }),
};

export const LOAD_COMMIT = 'COMMITS/LOAD_COMMIT';
export const loadCOMMIT: ActionCreator<t.RequestCommitAction> = (id) => ({
  type: LOAD_COMMIT,
  id,
});

export const STORE_COMMITS = 'COMMITS/STORE_COMMITS';
export const StoreCommits: ActionCreator<t.StoreCommitsAction> = (commits) => ({
  type: STORE_COMMITS,
  entities: commits,
});
