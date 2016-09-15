import { Reducer } from 'redux';

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
      const responseAction = <FetchError> action;
      id = responseAction.id;
      commit = state[id];
      if (!commit || isFetchError(commit)) {
        return Object.assign({}, state, { [id]: responseAction });
      }

      console.log('Error: fetching failed! Not replacing existing entity.'); // tslint:disable-line:no-console
      return state;
    case ADD_DEPLOYMENT_TO_COMMIT:
      id = action.id;
      commit = state[id];

      if (commit && !isFetchError(commit)) {
        if (commit.deployment !== action.deployment) {
          const newCommit = Object.assign({}, commit);
          commit.deployment = action.deployment;
          return Object.assign({}, state, { [id]: newCommit });
        }
      }

      console.log('Error: trying to add deployment to commit that does not exist.'); // tslint:disable-line:no-console
      return state;
    case STORE_COMMITS:
      commits = (<t.StoreCommitsAction> action).entities;
      if (commits && commits.length > 0) {
        const newCommitsObject: t.CommitState =
          commits.reduce<t.CommitState>((obj: t.CommitState, newCommit: t.Commit) =>
            Object.assign(obj, { [newCommit.id]: newCommit }),
          {});

        return Object.assign({}, state, newCommitsObject);
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
