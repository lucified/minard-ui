import * as uniq from 'lodash/uniq';
import * as moment from 'moment';
import { Reducer } from 'redux';

import { FetchError, isFetchError } from '../errors';
import { RequestFetchSpecificCollectionSuccessAction, RequestFetchSuccessAction } from '../types';

import { ADD_COMMITS_TO_BRANCH, BRANCH, BRANCHES_FOR_PROJECT, STORE_BRANCHES } from './actions';
import * as t from './types';

const initialState: t.BranchState = {};

const createBranchObject = (branch: t.ResponseBranchElement, state: t.BranchState): t.Branch => {
  const latestSuccessfullyDeployedCommitObject: { data?: { id: string }} | undefined = branch.relationships &&
    branch.relationships['latest-successfully-deployed-commit'];
  const latestSuccessfullyDeployedCommit: string | undefined = latestSuccessfullyDeployedCommitObject &&
    latestSuccessfullyDeployedCommitObject.data &&
    latestSuccessfullyDeployedCommitObject.data.id;

  const latestCommitObject: { data?: { id: string }} | undefined = branch.relationships &&
    branch.relationships['latest-commit'];
  const latestCommit: string | undefined = latestCommitObject &&
    latestCommitObject.data &&
    latestCommitObject.data.id;

  // Since we don't get commits information with project requests, let's keep
  // the existing commits list (if any)
  let commits: string[] = [];
  const existingBranch = state[branch.id];
  if (existingBranch && !isFetchError(existingBranch)) {
    commits = commits.concat(existingBranch.commits);
  }
  // Make sure latestSuccessfullyDeployedCommit and latestCommit are included in the list
  if (latestSuccessfullyDeployedCommit && commits.indexOf(latestSuccessfullyDeployedCommit) < 0) {
    commits.unshift(latestSuccessfullyDeployedCommit);
  }
  if (latestCommit && commits.indexOf(latestCommit) < 0) {
    commits.unshift(latestCommit);
  }

  const latestActivityTimestampString = branch.attributes['latest-activity-timestamp'];
  const latestActivityTimestamp = latestActivityTimestampString &&
    moment(latestActivityTimestampString).valueOf();

  return {
    id: branch.id,
    name: branch.attributes.name,
    description: branch.attributes.description,
    project: branch.relationships.project.data.id,
    minardJson: branch.attributes['minard-json'],
    latestActivityTimestamp,
    commits,
    latestCommit,
    latestSuccessfullyDeployedCommit,
  };
};

const responseToStateShape = (branches: t.ApiResponse, state: t.BranchState): t.BranchState =>
  branches.reduce<t.BranchState>((obj, branch) => {
    try {
      const stateObject = createBranchObject(branch, state);
      return Object.assign(obj, { [branch.id]: stateObject });
    } catch (e) {
      console.log('Error parsing branch:', branch, e); // tslint:disable-line:no-console
      return obj;
    }
  }, {});

const reducer: Reducer<t.BranchState> = (state = initialState, action: any) => {
  let branches: t.ResponseBranchElement[];
  let id: string;

  switch (action.type) {
    case BRANCH.SUCCESS:
      const branchResonse = (<RequestFetchSuccessAction<t.ResponseBranchElement>> action).response;
      if (branchResonse) {
        return Object.assign({}, state, responseToStateShape([branchResonse], state));
      }

      return state;
    case BRANCH.FAILURE:
      const responseAction = <FetchError> action;
      id = responseAction.id;
      const existingEntity = state[id];
      if (!existingEntity || isFetchError(existingEntity)) {
        return Object.assign({}, state, { [id]: responseAction });
      }

      console.log('Error: fetching failed! Not replacing existing entity.'); // tslint:disable-line:no-console
      return state;
    case BRANCHES_FOR_PROJECT.SUCCESS:
      branches = (<RequestFetchSpecificCollectionSuccessAction<t.ResponseBranchElement[]>> action).response;
      if (branches && branches.length > 0) {
        return Object.assign({}, state, responseToStateShape(branches, state));
      }
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

      return state;
    case STORE_BRANCHES:
      branches = (<t.StoreBranchesAction> action).entities;
      if (branches && branches.length > 0) {
        return Object.assign({}, state, responseToStateShape(branches, state));
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
