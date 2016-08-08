import { assign } from 'lodash';
import { Reducer } from 'redux';

import { BRANCH, STORE_BRANCHES } from './actions';
import * as t from './types';

const initialState: t.BranchState = {};

const responseToStateShape = (branches: t.ApiResponse) => {
  const createBranchObject = (branch: t.ResponseBranchElement): t.Branch => {
    const deployments = branch.relationships.deployments &&
      branch.relationships.deployments.data &&
      branch.relationships.deployments.data.map(d => d.id);
    const commits = branch.relationships.commits &&
      branch.relationships.commits.data &&
      branch.relationships.commits.data.map(c => c.id);

    return {
      id: branch.id,
      name: branch.attributes.name,
      description: branch.attributes.description,
      project: branch.relationships.project.data.id,
      deployments,
      commits,
    };
  };

  return branches.reduce((obj, branch) => assign(obj, { [branch.id]: createBranchObject(branch) }), {});
};

const reducer: Reducer<t.BranchState> = (state = initialState, action: any) => {
  switch (action.type) {
    case BRANCH.SUCCESS:
      const branchResonse = (<t.RequestBranchAction> action).response;
      if (branchResonse) {
        return assign<t.BranchState, t.BranchState>({}, state, responseToStateShape([branchResonse]));
      } else {
        return state;
      }
    case STORE_BRANCHES:
      const branches = (<t.StoreBranchesAction> action).entities;
      if (branches && branches.length > 0) {
        return assign<t.BranchState, t.BranchState>({}, state, responseToStateShape(branches));
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default reducer;
