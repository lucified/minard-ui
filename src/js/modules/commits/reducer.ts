import { mapKeys } from 'lodash';
import { Reducer } from 'redux';

import { logMessage } from '../../logger';
import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';

import { ADD_DEPLOYMENT_TO_COMMIT, STORE_COMMITS } from './actions';
import * as t from './types';

const initialState: t.CommitState = {};

const reducer: Reducer<t.CommitState> = (state = initialState, action: any) => {
  let commits: t.Commit[];
  let commit: t.Commit | FetchError | undefined;
  let id: string;

  switch (action.type) {
    case Requests.actions.Commits.LoadCommit.FAILURE.type:
      const responseAction = action as FetchError;
      id = responseAction.id;
      commit = state[id];
      if (!commit || isFetchError(commit)) {
        return {
          ...state,
          [id]: responseAction,
        };
      }

      logMessage('Fetching failed! Not replacing existing commit entity', { action });

      return state;
    case ADD_DEPLOYMENT_TO_COMMIT:
      id = action.id;
      commit = state[id];
      if (commit && !isFetchError(commit)) {
        if (commit.deployment !== action.deployment) {
          return {
            ...state,
            [id]: {
              ...commit,
              deployment: action.deployment,
            },
          };
        }

        return state;
      }

      console.log('Trying to add deployment to commit that does not exist.', action); // tslint:disable-line

      return state;
    case STORE_COMMITS:
      commits = (action as t.StoreCommitsAction).entities;
      if (commits && commits.length > 0) {
        const newCommitsObject: t.CommitState = mapKeys(commits, c => c.id);

        return {
          ...state,
          ...newCommitsObject,
        };
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
