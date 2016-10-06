import * as omit from 'lodash/omit';
import * as uniq from 'lodash/uniq';
import { Reducer } from 'redux';

import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';

import {
  ADD_COMMITS_TO_BRANCH,
  REMOVE_BRANCH,
  STORE_BRANCHES,
  STORE_COMMITS_TO_BRANCH,
  UPDATE_LATEST_DEPLOYED_COMMIT_FOR_BRANCH,
} from './actions';
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

      console.error('Fetching failed! Not replacing existing entity.');
      // We need to not load 'raven-js' when running tests
      if (typeof window !== 'undefined') {
        const Raven = require('raven-js');
        if (Raven.isSetup()) {
          Raven.captureMessage('Fetching failed! Not replacing existing entity.', { extra: { action, state } });
        }
      }

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

      console.error('Trying to save commits to branch that does not exist.');
      // We need to not load 'raven-js' when running tests
      if (typeof window !== 'undefined') {
        const Raven = require('raven-js');
        if (Raven.isSetup()) {
          Raven.captureMessage('Trying to save commits to branch that does not exist.', { extra: { action, state } });
        }
      }
      return state;
    case UPDATE_LATEST_DEPLOYED_COMMIT_FOR_BRANCH:
      const updateLatestDeployedAction = <t.UpdateLatestDeployedCommitAction> action;
      id = updateLatestDeployedAction.id;
      branch = state[id];

      if (branch && !isFetchError(branch)) {
        const { commit } = updateLatestDeployedAction;
        if (branch.latestSuccessfullyDeployedCommit !== commit) {
          const newBranch = Object.assign({}, branch, { latestSuccessfullyDeployedCommit: commit });
          return Object.assign({}, state, { [id]: newBranch });
        }

        return state;
      }

      console.error('Trying to save deployed commit to branch that does not exist.');
      // We need to not load 'raven-js' when running tests
      if (typeof window !== 'undefined') {
        const Raven = require('raven-js');
        if (Raven.isSetup()) {
          Raven.captureMessage(
            'Trying to save deployed commit to branch that does not exist.',
            { extra: { action, state } }
          );
        }
      }
      return state;
    case REMOVE_BRANCH:
      const removeAction = <t.RemoveBranchAction> action;
      id = removeAction.id;
      if (state[id]) {
        return omit<t.BranchState, t.BranchState>(state, id);
      }

      console.error('Trying to remove a branch that does not exist.');
      // We need to not load 'raven-js' when running tests
      if (typeof window !== 'undefined') {
        const Raven = require('raven-js');
        if (Raven.isSetup()) {
          Raven.captureMessage('Trying to remove a branch that does not exist.', { extra: { action, state } });
        }
      }
      return state;
    case STORE_COMMITS_TO_BRANCH:
      const storeCommitsAction = <t.StoreCommitsToBranchAction> action;
      id = storeCommitsAction.id;
      branch = state[id];
      if (branch && !isFetchError(branch)) {
        const newBranch = Object.assign({}, branch);

        // Try to find any of the parentIds in the commits of the branch
        let foundIndex = -1;
        storeCommitsAction.parentCommits.forEach((commitId: string) => {
          if (foundIndex === -1) {
            foundIndex = newBranch.commits.indexOf(commitId);
          }
        });

        const commitIds = storeCommitsAction.commits.map(commit => commit.id);

        if (foundIndex === -1) {
          // Not found, replace
          newBranch.commits = commitIds;
        } else {
          // Cut off any possibly replaced commits and add parent commit(s) to end
          newBranch.commits = commitIds.concat(newBranch.commits.slice(foundIndex));
        }

        newBranch.latestCommit = commitIds[0];
        newBranch.latestActivityTimestamp = storeCommitsAction.commits[0].committer.timestamp;

        return Object.assign({}, state, { [id]: newBranch });
      }

      console.error('Trying to add commits to a branch that does not exist.');
      // We need to not load 'raven-js' when running tests
      if (typeof window !== 'undefined') {
        const Raven = require('raven-js');
        if (Raven.isSetup()) {
          Raven.captureMessage('Trying to add commits to a branch that does not exist.', { extra: { action, state } });
        }
      }
      return state;
    case STORE_BRANCHES:
      const storeAction = <t.StoreBranchesAction> action;
      branches = storeAction.entities;
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
