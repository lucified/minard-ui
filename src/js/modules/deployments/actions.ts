import { ActionCreator } from 'redux';

import { createRequestTypes } from '../common';
import * as t from './types';

export const DEPLOYMENT = createRequestTypes('DEPLOYMENTS/DEPLOYMENT');
export const FetchDeployment: t.DeploymentsRequestActionCreators = {
  request: (id) => ({ type: DEPLOYMENT.REQUEST, id }),
  success: (id, response) => ({ type: DEPLOYMENT.SUCCESS, id, response }),
  failure: (id, error) => ({ type: DEPLOYMENT.FAILURE, id, error }),
};

export const LOAD_DEPLOYMENT = 'DEPLOYMENTS/LOAD_DEPLOYMENT';
export const loadDeployment: ActionCreator<t.LoadDeploymentAction> = (id) => ({
  type: LOAD_DEPLOYMENT,
  id,
});

export const STORE_DEPLOYMENTS = 'DEPLOYMENTS/STORE_DEPLOYMENTS';
export const StoreDeployments: ActionCreator<t.StoreDeploymentsAction> = (deployments) => ({
  type: STORE_DEPLOYMENTS,
  deployments,
});
