import * as t from './types';

export const LOAD_DEPLOYMENT = 'DEPLOYMENTS/LOAD_DEPLOYMENT';
export const loadDeployment = (id: string): t.LoadDeploymentAction => ({
  type: LOAD_DEPLOYMENT,
  id,
});

export const STORE_DEPLOYMENTS = 'DEPLOYMENTS/STORE_DEPLOYMENTS';
export const storeDeployments = (deployments: t.Deployment[]): t.StoreDeploymentsAction => ({
  type: STORE_DEPLOYMENTS,
  entities: deployments,
});
