import { Reducer } from 'redux';

import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';

import { STORE_DEPLOYMENTS } from './actions';
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

      console.error('Fetching failed! Not replacing existing entity.');
      // We need to not load 'raven-js' when running tests
      if (typeof window !== 'undefined') {
        const Raven = require('raven-js');
        if (Raven.isSetup()) {
          Raven.captureMessage('Fetching failed! Not replacing existing entity.', { extra: { action } });
        }
      }

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
    default:
      return state;
  }
};

export default reducer;
