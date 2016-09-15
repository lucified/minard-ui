import * as omit from 'lodash/omit';
import * as uniq from 'lodash/uniq';
import { Reducer } from 'redux';

import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';

import { ADD_COMMITS_TO_BRANCH, REMOVE_BRANCH, STORE_BRANCHES, STORE_COMMITS_TO_BRANCH } from './actions';
import * as t from './types';

const initialState: t.BranchState = {};

const reducer: Reducer<t.BranchState> = (state = initialState, action: any) => {
  let branches: t.Branch[];
  let branch: t.Branch | FetchError;
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
      branch = state[commitsAction.id];
      if (branch && !isFetchError(branch)) {
        // Note: the commits list might not be sorted by time now
        const newCommitsList = uniq(branch.commits.concat(commitsAction.commits));
        const newBranch = Object.assign({}, branch, {
          commits: newCommitsList,
          allCommitsLoaded: commitsAction.commits.length < commitsAction.requestedCount,
        });
        return Object.assign({}, state, { [commitsAction.id]: newBranch });
      }

      console.log('Error: trying to save commits to branch that does not exist.'); // tslint:disable-line:no-console
      return state;
    case REMOVE_BRANCH:
      id = action.id;
      if (state[id]) {
        return omit<t.BranchState, t.BranchState>(state, id);
      }

      console.log('Error: trying to remove a branch that does not exist.'); // tslint:disable-line:no-console
      return state;
    case STORE_COMMITS_TO_BRANCH:
      id = action.id;
      branch = state[id];
      if (branch && !isFetchError(branch)) {
        const newBranch = Object.assign({}, branch);

        // Try to find any of the parentIds in the commits of the branch
        let foundIndex = -1;
        action.parentCommits.forEach((commitId: string) => {
          if (foundIndex === -1) {
            foundIndex = newBranch.commits.indexOf(commitId);
          }
        });

        if (foundIndex === -1) {
          // Not found, replace
          newBranch.commits = action.commits;
        } else {
          // Cut off any possibly replaced commits and add parent commit(s) to end
          newBranch.commits = action.commits.concat(newBranch.commits.slice(foundIndex));
        }

        return Object.assign({}, state, { [id]: newBranch });
      }

      console.log('Error: trying to add commits to a branch that does not exist.'); // tslint:disable-line:no-console
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
