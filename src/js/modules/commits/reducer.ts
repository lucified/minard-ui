import { mapKeys } from 'lodash';
import { Reducer } from 'redux';

import { logMessage } from '../../logger';
import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';

import { CLEAR_STORED_DATA } from '../user';
import { ADD_DEPLOYMENT_TO_COMMIT, STORE_COMMITS } from './actions';
import { AddDeploymentToCommitAction, Commit, CommitState, StoreCommitsAction } from './types';

const initialState: CommitState = {};

const reducer: Reducer<CommitState> = (state = initialState, action: any) => {
  let commits: Commit[];
  let commit: Commit | FetchError | undefined;
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
      const addDeploymentAction = action as AddDeploymentToCommitAction;
      id = addDeploymentAction.id;
      const deployment = addDeploymentAction.deployment;
      commit = state[id];
      if (commit && !isFetchError(commit)) {
        if (commit.deployment !== deployment) {
          return {
            ...state,
            [id]: {
              ...commit,
              deployment,
            },
          };
        }

        return state;
      }

      console.warn('Trying to add deployment to commit that does not exis', action);

      return state;
    case STORE_COMMITS:
      commits = (action as StoreCommitsAction).entities;
      if (commits && commits.length > 0) {
        const newCommitsObject: CommitState = mapKeys(commits, c => c.id);

        return {
          ...state,
          ...newCommitsObject,
        };
      }

      return state;
    case CLEAR_STORED_DATA:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
