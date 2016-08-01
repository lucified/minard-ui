import { merge } from 'lodash';
import * as moment from 'moment';

import { DEPLOYMENT, STORE_DEPLOYMENTS } from './actions';
import * as t from './types';

//const screenshot = require('../../../images/screenshot.png');

const initialState: t.DeploymentState = {};

const responseToStateShape = (deployments: t.ApiResponse) => {
  const deploymentObjects: t.DeploymentState = {};

  deployments.forEach(deployment => {
    deploymentObjects[deployment.id] = {
      id: deployment.id,
      url: deployment.attributes.url,
      screenshot: deployment.attributes.screenshot,
      commit: deployment.relationships.commit.data.id,
      creator: {
        name: deployment.attributes.creator.name,
        email: deployment.attributes.creator.email,
        timestamp: moment(deployment.attributes.creator.timestamp).milliseconds(),
      },
    };
  });

  return deploymentObjects;
};

export default (state: t.DeploymentState = initialState, action: any) => {
  switch (action.type) {
    case DEPLOYMENT.SUCCESS:
      const deploymentResponse = (<t.LoadDeploymentAction> action).response;
      return merge({}, state, responseToStateShape([deploymentResponse]));
    case STORE_DEPLOYMENTS:
      const deployments = (<t.StoreDeploymentsAction> action).deployments;
      return merge({}, state, responseToStateShape(deployments));
    default:
      return state;
  }
};
