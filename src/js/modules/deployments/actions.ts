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

export const SET_COMMENTS_FOR_DEPLOYMENT = 'DEPLOYMENTS/SET_COMMENTS_FOR_DEPLOYMENT';
export const setCommentsForDeployment = (id: string, comments: string[]) => ({
  type: SET_COMMENTS_FOR_DEPLOYMENT,
  id,
  comments,
});

export const ADD_COMMENTS_TO_DEPLOYMENT = 'DEPLOYMENTS/ADD_COMMENTS_TO_DEPLOYMENT';
export const addCommentsToDeployment = (id: string, comments: string[]) => ({
  type: ADD_COMMENTS_TO_DEPLOYMENT,
  id,
  comments,
});
