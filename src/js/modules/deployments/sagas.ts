import { Effect, takeEvery } from 'redux-saga/effects';

import { toDeployments } from '../../api/convert';
import { Api } from '../../api/types';
import { createEntityFetcher, createLoader } from '../../sagas/utils';
import Requests from '../requests';
import { LOAD_DEPLOYMENT, storeDeployments } from './actions';
import { getDeployment } from './selectors';

export default function createSagas(api: Api) {
  // DEPLOYMENT
  const fetchDeployment = createEntityFetcher(
    Requests.actions.Deployments.LoadDeployment,
    toDeployments,
    storeDeployments,
    api.Deployment.fetch,
  );
  const loadDeployment = createLoader(getDeployment, fetchDeployment, ensureDeploymentRelatedDataLoaded);

  function* ensureDeploymentRelatedDataLoaded(_id: string): IterableIterator<Effect> {
    // Nothing to do
  }

  return {
    sagas: [
      takeEvery(LOAD_DEPLOYMENT, loadDeployment),
    ],
    fetcher: fetchDeployment,
  };
}
