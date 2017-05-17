/*
import { expect } from 'chai';

import Requests from '../requests';
// import { STORE_PROJECTS } from './actions';
import reducer from './reducer';
import { DeploymentState, DeploymentStatus } from './types';

describe('Deployments reducer', () => {
  const expectedObjectsToStore: DeploymentState = {
    7: {
      id: '7',
      status: DeploymentStatus.Success,
      url: '#',
      screenshot: 'https://www.lucify.com/images/lucify-asylum-countries-open-graph-size-5adef1be36.png',
      creator: {
        name: 'Ville Saarinen',
        email: 'ville.saarinen@lucify.com',
        timestamp: 1470131481802,
      },
      token: 'foobartoken',
    },
  };

  const storeAction = {
    type: STORE_DEPLOYMENTS,
    entities: expectedObjectsToStore,
  };

  const stateWithoutExistingEntity: DeploymentState = {
    8: {
      id: '8',
      status: DeploymentStatus.Success,
      url: '#',
      screenshot: 'https://www.lucify.com/images/lucify-asylum-countries-open-graph-size-5adef1be36.png',
      creator: {
        name: undefined,
        email: 'juho@lucify.com',
        timestamp: 1470131581802,
      },
      token: 'foobartoken',
    },
  };

  const stateWithExistingEntity: DeploymentState = {
    7: {
      id: '7',
      status: DeploymentStatus.Success,
      url: 'foo#',
      screenshot: 'bar#',
      creator: {
        name: 'Ville',
        email: 'ville.saarinen@lucify.com',
        timestamp: 1470131481802,
      },
      token: 'foobartoken',
    },
  };

  const failedRequestObject: FetchError = {
    id: '7',
    type: Requests.actions.Deployments.LoadDeployment.FAILURE.type,
    error: 'Error message in testing',
    details: 'Detailed message in testing',
    prettyError: 'Pretty error message in testing',
  };

  testReducer(
    reducer,
    storeAction,
    expectedObjectsToStore,
    stateWithoutExistingEntity,
    stateWithExistingEntity,
    failedRequestObject,
  );
});
*/
