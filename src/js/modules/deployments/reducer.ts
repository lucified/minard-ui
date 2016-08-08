import { assign } from 'lodash';
import * as moment from 'moment';
import { Reducer } from 'redux';

import { FetchError } from '../errors';

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
    assign(obj, { [deployment.id]: createDeploymentObject(deployment) }), {});
};

const reducer: Reducer<t.DeploymentState> = (state = initialState, action: any) => {
  switch (action.type) {
    case DEPLOYMENT.SUCCESS:
      const deploymentResponse = (<t.RequestDeploymentAction> action).response;
      if (deploymentResponse) {
        return assign<t.DeploymentState, t.DeploymentState>({}, state, responseToStateShape([deploymentResponse]));
      } else {
        return state;
      }
    case DEPLOYMENT.FAILURE:
      const responseAction = <FetchError> action;
      return assign<t.DeploymentState, t.DeploymentState>({}, state, { [responseAction.id]: responseAction });
    case STORE_DEPLOYMENTS:
      const deployments = (<t.StoreDeploymentsAction> action).entities;
      if (deployments && deployments.length > 0) {
        return assign<t.DeploymentState, t.DeploymentState>({}, state, responseToStateShape(deployments));
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default reducer;
