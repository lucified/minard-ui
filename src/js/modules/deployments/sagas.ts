import { call, Effect, takeEvery } from 'redux-saga/effects';

import { toDeployments } from '../../api/convert';
import { Api } from '../../api/types';
import { createEntityFetcher, createLoader } from '../../sagas/utils';
import Requests from '../requests';
import { FETCH_DEPLOYMENT, LOAD_DEPLOYMENT, storeDeployments } from './actions';
import { getDeployment } from './selectors';
import { FetchDeploymentAction } from './types';

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

  function* startFetchDeployment(action: FetchDeploymentAction) {
    yield call(fetchDeployment, action.id);
  }

  return {
    functions: {
      fetchDeployment,
      loadDeployment,
      ensureDeploymentRelatedDataLoaded,
    },
    sagas: [
      takeEvery(LOAD_DEPLOYMENT, loadDeployment),
      takeEvery(FETCH_DEPLOYMENT, startFetchDeployment),
    ],
  };
}
