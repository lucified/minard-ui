import { Reducer } from 'redux';

import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';

import { STORE_COMMITS } from './actions';
import * as t from './types';

const initialState: t.CommitState = {};

const reducer: Reducer<t.CommitState> = (state = initialState, action: any) => {
  let commits: t.Commit[];

  switch (action.type) {
    case Requests.actions.Commits.LoadCommit.FAILURE.type:
      const responseAction = <FetchError> action;
      const existingEntity = state[responseAction.id];
      if (!existingEntity || isFetchError(existingEntity)) {
        return Object.assign({}, state, { [responseAction.id]: responseAction });
      }

      console.log('Error: fetching failed! Not replacing existing entity.'); // tslint:disable-line:no-console
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
