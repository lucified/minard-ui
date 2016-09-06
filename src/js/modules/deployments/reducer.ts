import * as moment from 'moment';
import { Reducer } from 'redux';

import { FetchError, isFetchError } from '../errors';
import { RequestFetchSuccessAction } from '../types';

import { DEPLOYMENT, STORE_DEPLOYMENTS } from './actions';
import * as t from './types';

const initialState: t.DeploymentState = {};

const createDeploymentObject = (deployment: t.ResponseDeploymentElement): t.Deployment => ({
  id: deployment.id,
  status: deployment.attributes.status,
  url: deployment.attributes.url,
  screenshot: deployment.attributes.screenshot,
  creator: {
    name: deployment.attributes.creator.name,
    email: deployment.attributes.creator.email,
    timestamp: moment(deployment.attributes.creator.timestamp).valueOf(),
  },
});

const responseToStateShape = (deployments: t.ApiResponse): t.DeploymentState =>
  deployments.reduce<t.DeploymentState>((obj, deployment) => {
    try {
      const stateObject = createDeploymentObject(deployment);
      return Object.assign(obj, { [deployment.id]: stateObject });
    } catch (e) {
      console.log('Error parsing deployment:', deployment, e); // tslint:disable-line:no-console
      return obj;
    }
  }, {});

const reducer: Reducer<t.DeploymentState> = (state = initialState, action: any) => {
  switch (action.type) {
    case DEPLOYMENT.SUCCESS:
      const deploymentResponse = (<RequestFetchSuccessAction<t.ResponseDeploymentElement>> action).response;
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
