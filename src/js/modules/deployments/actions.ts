import { ActionCreator } from 'redux';

import { createRequestTypes } from '../common';
import * as t from './types';

export const DEPLOYMENT = createRequestTypes('DEPLOYMENTS/DEPLOYMENT');
export const FetchDeployment: t.DeploymentsRequestActionCreators = {
  request: (id, projectId) => ({ type: DEPLOYMENT.REQUEST, id, projectId }),
  success: (id, projectId, response) => ({ type: DEPLOYMENT.SUCCESS, id, projectId, response }),
  failure: (id, projectId, error) => ({ type: DEPLOYMENT.FAILURE, id, projectId, error }),
};

export const LOAD_DEPLOYMENT = 'DEPLOYMENTS/LOAD_DEPLOYMENT';
export const loadDeployment: ActionCreator<t.LoadDeploymentAction> = (id, projectId) => ({
  type: LOAD_DEPLOYMENT,
  id,
  projectId,
});

export const STORE_DEPLOYMENTS = 'DEPLOYMENTS/STORE_DEPLOYMENTS';
export const StoreDeployments: ActionCreator<t.StoreDeploymentsAction> = (deployments) => ({
  type: STORE_DEPLOYMENTS,
  deployments,
});
