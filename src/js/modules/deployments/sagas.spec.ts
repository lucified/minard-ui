// tslint:disable:no-object-literal-type-assertion

import { expect } from 'chai';

import { toDeployments } from '../../api/convert';
import Requests from '../requests';
import Deployments, {
} from './index';

import { createApi, testData, testEntityFetcher, testLoader } from '../../sagas/test-utils';
import createSagas from './sagas';

describe('Deployments sagas', () => {
  const api = createApi();
  const sagaFunctions = createSagas(api).functions;

  testLoader(
    'loadDeployment',
    sagaFunctions.loadDeployment,
    Deployments.selectors.getDeployment,
    sagaFunctions.fetchDeployment,
    sagaFunctions.ensureDeploymentRelatedDataLoaded,
  );

  testEntityFetcher(
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
