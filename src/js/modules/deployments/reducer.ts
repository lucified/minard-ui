import * as moment from 'moment';
import { Reducer } from 'redux';

import { FetchError, isFetchError } from '../errors';

import { DEPLOYMENT, STORE_DEPLOYMENTS } from './actions';
import * as t from './types';

const initialState: t.DeploymentState = {};

const responseToStateShape = (deployments: t.ApiResponse) => {
  const createDeploymentObject = (deployment: t.ResponseDeploymentElement): t.Deployment => {
    return {
      id: deployment.id,
      status: deployment.attributes.status,
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

  return deployments.reduce((obj, deployment) => {
    try {
      const stateObject = createDeploymentObject(deployment);
      return Object.assign(obj, { [deployment.id]: stateObject });
    } catch (e) {
      console.log('Error parsing deployment:', deployment, e); // tslint:disable-line:no-console
      return obj;
    }
  }, {});
};

const reducer: Reducer<t.DeploymentState> = (state = initialState, action: any) => {
  switch (action.type) {
    case DEPLOYMENT.SUCCESS:
      const deploymentResponse = (<t.RequestDeploymentSuccessAction> action).response;
      if (deploymentResponse) {
        return Object.assign({}, state, responseToStateShape([deploymentResponse]));
      }

      return state;
    case DEPLOYMENT.FAILURE:
      const responseAction = <FetchError> action;
      const id = responseAction.id;
      const existingEntity = state[id];
      if (!existingEntity || isFetchError(existingEntity)) {
        return Object.assign({}, state, { [id]: responseAction });
      }

      console.log('Error: fetching failed! Not replacing existing entity.'); // tslint:disable-line:no-console
      return state;
    case STORE_DEPLOYMENTS:
      const deployments = (<t.StoreDeploymentsAction> action).entities;
      if (deployments && deployments.length > 0) {
        return Object.assign({}, state, responseToStateShape(deployments));
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
