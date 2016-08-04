import { merge } from 'lodash';

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

  return branches.reduce((obj, branch) => merge(obj, { [branch.id]: createBranchObject(branch) }), {});
};

export default (state: t.BranchState = initialState, action: any) => {
  switch (action.type) {
    case BRANCH.SUCCESS:
      const branchResonse = (<t.RequestBranchAction> action).response;
      return merge({}, state, responseToStateShape([branchResonse]));
    case STORE_BRANCHES:
      const branches = (<t.StoreBranchesAction> action).branches;
      return merge({}, state, responseToStateShape(branches));
    default:
      return state;
  }
};
