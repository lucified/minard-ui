import { mapKeys, omit, uniq, xor } from 'lodash';
import { Reducer } from 'redux';

import { logMessage } from '../../logger';
import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';

import {
  ADD_COMMITS_TO_BRANCH,
  REMOVE_BRANCH,
  STORE_BRANCHES,
  UPDATE_BRANCH_WITH_COMMITS,
  UPDATE_LATEST_ACTIVITY_TIMESTAMP_FOR_BRANCH,
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
        return {
          ...state,
          [id]: responseAction,
        };
      }

      logMessage('Fetching failed! Not replacing existing branch entity', { action });

      return state;
    case ADD_COMMITS_TO_BRANCH:
      const commitsAction = <t.AddCommitsToBranchAction> action;
      branch = state[commitsAction.id];
      if (branch && !isFetchError(branch)) {
        // Note: we assume we always get older commits, sorted by time in reverse

        if (xor(branch.commits, commitsAction.commits).length > 0) {
          const newCommitsList = uniq(branch.commits.concat(commitsAction.commits));
          return {
            ...state,
            [commitsAction.id]: {
              ...branch,
              commits: newCommitsList,
              allCommitsLoaded: commitsAction.commits.length < commitsAction.requestedCount,
            },
          };
        }

        return state;
      }

      return state;
    case UPDATE_LATEST_DEPLOYED_COMMIT_FOR_BRANCH:
      const updateLatestDeployedAction = <t.UpdateLatestDeployedCommitAction> action;
      id = updateLatestDeployedAction.id;
      branch = state[id];

      if (branch && !isFetchError(branch)) {
        const { commit } = updateLatestDeployedAction;
        if (branch.latestSuccessfullyDeployedCommit !== commit) {
          return {
            ...state,
            [id]: {
              ...branch,
              latestSuccessfullyDeployedCommit: commit,
            },
          };
        }

        return state;
      }

      return state;
    case REMOVE_BRANCH:
      const removeAction = <t.RemoveBranchAction> action;
      id = removeAction.id;
      if (state[id]) {
        return omit<t.BranchState, t.BranchState>(state, id);
      }

      return state;
    // Saves any new commits and sets the latestCommit of the branch
    case UPDATE_BRANCH_WITH_COMMITS:
      const storeCommitsAction = <t.UpdateBranchWithCommitsAction> action;
      id = storeCommitsAction.id;
      branch = state[id];
      if (branch && !isFetchError(branch)) {
        const newBranch = {
          ...branch,
          latestCommit: storeCommitsAction.latestCommitId,
        };

        // Try to find any of the parentIds in the commits of the branch
        let foundIndex = -1;
        if (storeCommitsAction.parentCommitIds.length > 0) {
          storeCommitsAction.parentCommitIds.forEach((parentCommitId: string) => {
            if (foundIndex === -1) {
              foundIndex = newBranch.commits.indexOf(parentCommitId);
            }
          });
        } else {
          // The event has no parents if the branch was reset to an older commit
          foundIndex = newBranch.commits.indexOf(storeCommitsAction.latestCommitId);
        }

        const newCommitIds = storeCommitsAction.newCommits.map(commit => commit.id);

        if (foundIndex === -1) {
          // Not found, replace
          newBranch.commits = newCommitIds.length > 0 ? newCommitIds : [storeCommitsAction.latestCommitId];
        } else {
          // Cut off any possibly replaced commits and add existing commit(s) to end
          newBranch.commits = newCommitIds.concat(newBranch.commits.slice(foundIndex));
        }

        return {
          ...state,
          [id]: newBranch,
        };
      }

      return state;
    case UPDATE_LATEST_ACTIVITY_TIMESTAMP_FOR_BRANCH:
      const updateActivityTimestampAction = <t.UpdateLatestActivityTimestampAction> action;
      id = updateActivityTimestampAction.id;
      branch = state[id];

      if (branch && !isFetchError(branch)) {
        const { timestamp } = updateActivityTimestampAction;
        if (branch.latestActivityTimestamp !== timestamp) {
          return {
            ...state,
            [id]: {
              ...branch,
              latestActivityTimestamp: timestamp,
            },
          };
        }
      }

      return state;
    case STORE_BRANCHES:
      const storeAction = <t.StoreBranchesAction> action;
      branches = storeAction.entities;
      if (branches && branches.length > 0) {
        const newBranchesObject: t.BranchState = mapKeys(branches, b => b.id);

        return {
          ...state,
          ...newBranchesObject,
        };
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
