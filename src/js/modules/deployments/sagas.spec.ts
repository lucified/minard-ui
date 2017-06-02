// tslint:disable:no-object-literal-type-assertion

import { expect } from 'chai';

import { toDeployments } from '../../api/convert';
import Requests from '../requests';
import Deployments from './index';

import {
  createApi,
  testData,
  testEntityFetcherSaga,
  testLoaderSaga,
} from '../../../../test/test-utils';
import createSagas from './sagas';

describe('Deployments sagas', () => {
  const api = createApi();
  const sagaFunctions = createSagas(api).functions;

  testLoaderSaga(
    'loadDeployment',
    sagaFunctions.loadDeployment,
    Deployments.selectors.getDeployment,
    sagaFunctions.fetchDeployment,
    sagaFunctions.ensureDeploymentRelatedDataLoaded,
  );

  testEntityFetcherSaga(
    'fetchDeployment',
    testData.deploymentResponse,
    { data: testData.deploymentResponse.data },
    Requests.actions.Deployments.LoadDeployment,
    sagaFunctions.fetchDeployment,
    api.Deployment.fetch,
    toDeployments,
    Deployments.actions.storeDeployments,
  );

  describe('ensureDeploymentRelatedDataLoaded', () => {
    it('does nothing', () => {
      const iterator = sagaFunctions.ensureDeploymentRelatedDataLoaded('foo');

      expect(iterator.next().done).to.equal(true);
    });
  });
});
