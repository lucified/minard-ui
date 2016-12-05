import { Reducer } from 'redux';

import { logMessage } from '../../logger';
import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';

import { ADD_COMMENTS_TO_DEPLOYMENT, STORE_DEPLOYMENTS } from './actions';
import * as t from './types';

const initialState: t.DeploymentState = {};

const reducer: Reducer<t.DeploymentState> = (state = initialState, action: any) => {
  switch (action.type) {
    case Requests.actions.Deployments.LoadDeployment.FAILURE.type:
      const responseAction = <FetchError> action;
      const id = responseAction.id;
      const existingEntity = state[id];
      if (!existingEntity || isFetchError(existingEntity)) {
        return Object.assign({}, state, { [id]: responseAction });
      }

      logMessage('Fetching failed! Not replacing existing deployment entity', { action });

      return state;
    case STORE_DEPLOYMENTS:
      const deploymentsArray = (<t.StoreDeploymentsAction> action).entities;
      if (deploymentsArray && deploymentsArray.length > 0) {
        const newDeploymentsObject: t.DeploymentState =
          deploymentsArray.reduce<t.DeploymentState>((obj: t.DeploymentState, newDeployment: t.Deployment) =>
            Object.assign(obj, { [newDeployment.id]: newDeployment }),
          {});

        return Object.assign({}, state, newDeploymentsObject);
      }

      return state;
    case ADD_COMMENTS_TO_DEPLOYMENT:
      const commentsAction = <t.AddCommentsToDeploymentAction> action;
      const deployment = state[commentsAction.id];
      if (deployment && !isFetchError(deployment)) {
        const newDeployment = Object.assign({}, deployment, { comments: commentsAction.comments });
        return Object.assign({}, state, { [commentsAction.id]: newDeployment });
      }

      logMessage('Trying to add comments to a deployment that does not exist', { action });

      return state;
    default:
      return state;
  }
};

export default reducer;
