import { merge } from 'lodash';

import { BRANCH, STORE_BRANCHES } from './actions';
import * as t from './types';

const initialState: t.BranchState = {};

const responseToStateShape = (branches: t.ApiResponse) => {
  const branchObjects: t.BranchState = {};

  branches.forEach(branch => {
    branchObjects[branch.id] = {
      id: branch.id,
      name: branch.attributes.name,
      description: branch.attributes.description,
      project: branch.relationships.project.data.id,
      deployments: branch.relationships.deployments.data.map(d => d.id),
      commits: branch.relationships.commits.data.map(c => c.id),
    };
  });

  return branchObjects;
};

export default (state: t.BranchState = initialState, action: any) => {
  switch (action.type) {
    case BRANCH.SUCCESS:
      const branchResonse = (<t.LoadBranchAction> action).response;
      return merge({}, state, responseToStateShape([branchResonse]));
    case STORE_BRANCHES:
      const branches = (<t.StoreBranchesAction> action).branches;
      return merge({}, state, responseToStateShape(branches));
    default:
      return state;
  }
};
