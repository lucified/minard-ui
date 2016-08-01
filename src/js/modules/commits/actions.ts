import { ActionCreator } from 'redux';

import * as t from './types';

export const STORE_COMMITS = 'COMMITS/STORE_COMMITS';
export const StoreCommits: ActionCreator<t.StoreCommitsAction> = (commits) => ({
  type: STORE_COMMITS,
  commits,
});
