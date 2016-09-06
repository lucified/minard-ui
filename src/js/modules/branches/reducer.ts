import { Reducer } from 'redux';

import { FetchError, isFetchError } from '../errors';
import { RequestFetchSuccessAction } from '../types';

import { BRANCH, STORE_BRANCHES } from './actions';
import * as t from './types';

const initialState: t.BranchState = {};

const createBranchObject = (branch: t.ResponseBranchElement, state: t.BranchState): t.Branch => {
  // Since we don't get commits information with project requests, let's keep
  // the existing commits list (if any)
  let commits: string[] | undefined;
  const existingBranch = state[branch.id];
  if (existingBranch && !isFetchError(existingBranch)) {
    commits = existingBranch.commits;
  }

  return {
    id: branch.id,
    name: branch.attributes.name,
    description: branch.attributes.description,
    project: branch.relationships.project.data.id,
    commits,
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
  switch (action.type) {
    case BRANCH.SUCCESS:
      const branchResonse = (<RequestFetchSuccessAction<t.ResponseBranchElement>> action).response;
      if (branchResonse) {
        return Object.assign({}, state, responseToStateShape([branchResonse], state));
      }

      return state;
    case BRANCH.FAILURE:
      const responseAction = <FetchError> action;
      const id = responseAction.id;
      const existingEntity = state[id];
      if (!existingEntity || isFetchError(existingEntity)) {
        return Object.assign({}, state, { [id]: responseAction });
      }

      console.log('Error: fetching failed! Not replacing existing entity.'); // tslint:disable-line:no-console
      return state;
    case STORE_BRANCHES:
      const branches = (<t.StoreBranchesAction> action).entities;
      if (branches && branches.length > 0) {
        return Object.assign({}, state, responseToStateShape(branches, state));
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
