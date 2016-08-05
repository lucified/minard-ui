import { merge } from 'lodash';
import * as moment from 'moment';
import { Reducer } from 'redux';

import { DEPLOYMENT, STORE_DEPLOYMENTS } from './actions';
import * as t from './types';

const initialState: t.DeploymentState = {};

const responseToStateShape = (deployments: t.ApiResponse) => {
  const createDeploymentObject = (deployment: t.ResponseDeploymentElement): t.Deployment => {
    return {
      id: deployment.id,
      url: deployment.attributes.url,
      screenshot: deployment.attributes.screenshot,
      commit: deployment.relationships.commit.data.id,
      creator: {
        name: deployment.attributes.creator.name,
        email: deployment.attributes.creator.email,
        timestamp: moment(deployment.attributes.creator.timestamp).valueOf(),
      },
    };
  };

  return deployments.reduce((obj, deployment) =>
    merge(obj, { [deployment.id]: createDeploymentObject(deployment) }), {});
};

const reducer: Reducer<t.DeploymentState> = (state = initialState, action: any) => {
  switch (action.type) {
    case DEPLOYMENT.SUCCESS:
      const deploymentResponse = (<t.RequestDeploymentAction> action).response;
      return merge({}, state, responseToStateShape([deploymentResponse]));
    case STORE_DEPLOYMENTS:
      const deployments = (<t.StoreDeploymentsAction> action).deployments;
      return merge({}, state, responseToStateShape(deployments));
    default:
      return state;
  }
};

export default reducer;
