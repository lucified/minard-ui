import * as uniq from 'lodash/uniq';
import { Reducer } from 'redux';

import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';

import { ADD_COMMITS_TO_BRANCH, STORE_BRANCHES } from './actions';
import * as t from './types';

const initialState: t.BranchState = {};

const reducer: Reducer<t.BranchState> = (state = initialState, action: any) => {
  let branches: t.Branch[];
  let id: string;

  switch (action.type) {
    case Requests.actions.Branches.LoadBranch.FAILURE.type:
      const responseAction = <FetchError> action;
      id = responseAction.id;
      const existingEntity = state[id];
      if (!existingEntity || isFetchError(existingEntity)) {
        return Object.assign({}, state, { [id]: responseAction });
      }

      console.log('Error: fetching failed! Not replacing existing entity.'); // tslint:disable-line:no-console
      return state;
    case ADD_COMMITS_TO_BRANCH:
      const commitsAction = <t.AddCommitsToBranchAction> action;
      const branch = state[commitsAction.id];
      if (branch && !isFetchError(branch)) {
        // Note: the commits list might not be sorted by time now
        const newCommitsList = uniq(branch.commits.concat(commitsAction.commits));
        const newBranch = Object.assign({}, branch, { commits: newCommitsList });
        return Object.assign({}, state, { [commitsAction.id]: newBranch });
      }

      console.log('Error: trying save commits to branch that does not exist.'); // tslint:disable-line:no-console
      return state;
    case STORE_BRANCHES:
      branches = (<t.StoreBranchesAction> action).entities;
      if (branches && branches.length > 0) {
        const newBranchesObject: t.BranchState =
          branches.reduce<t.BranchState>((obj: t.BranchState, newBranch: t.Branch) => {
            // If existing branch has commits, merge these
            const existingBranch = state[newBranch.id];
            if (existingBranch && !isFetchError(existingBranch) && existingBranch.commits.length > 0) {
              newBranch.commits = uniq(newBranch.commits.concat(existingBranch.commits));
            }

            return Object.assign(obj, { [newBranch.id]: newBranch });
          }, {});

        return Object.assign({}, state, newBranchesObject);
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
