import {
  call,
  Effect,
  fork,
  put,
  select,
  take,
  throttle,
} from 'redux-saga/effects';

import { toActivities } from '../../api/convert';
import { Api, ApiEntity, ApiEntityResponse } from '../../api/types';
import {
  createCollectionFetcher,
  createEntityFetcher,
} from '../../sagas/utils';
import Requests from '../requests';
import {
  LOAD_ACTIVITIES,
  LOAD_ACTIVITIES_FOR_PROJECT,
  storeActivities,
} from './actions';
import { LoadActivitiesAction, LoadActivitiesForProjectAction } from './types';

export default function createSagas(api: Api) {
  // ALL ACTIVITIES
  function* loadActivities(
    action: LoadActivitiesAction,
  ): IterableIterator<Effect> {
    const { teamId, count, until } = action;
    const fetchSuccess = yield call(fetchActivities, teamId, count, until);
    if (fetchSuccess) {
      yield fork(ensureActivitiesRelatedDataLoaded);
    }
  }

  const fetchActivities = createCollectionFetcher<string | number | undefined>(
    Requests.actions.Activities.LoadAllActivities,
    toActivities,
    storeActivities,
    api.Activity.fetchAll,
    checkIfAllActivitiesLoaded,
  );

  function* checkIfAllActivitiesLoaded(
    response: ApiEntityResponse,
    count: number,
    _until?: number,
  ): IterableIterator<Effect> {
    if ((response.data as ApiEntity[]).length < count) {
      yield put(Requests.actions.allActivitiesRequested());
    }
  }

  function* ensureActivitiesRelatedDataLoaded(): IterableIterator<
    Effect | Effect[]
  > {
    // Do nothing. Activities are self-contained
  }

  // PROJECT ACTIVITIES
  function* loadActivitiesForProject(
    action: LoadActivitiesForProjectAction,
  ): IterableIterator<Effect> {
    const { id, count, until } = action;

    // Return if we're already requesting
    if (yield select(Requests.selectors.isLoadingActivitiesForProject, id)) {
      return;
    }

    const fetchSuccess = yield call(
      fetchActivitiesForProject,
      id,
      count,
      until,
    );
    if (fetchSuccess) {
      yield fork(ensureActivitiesRelatedDataLoaded);
    }
  }

  const fetchActivitiesForProject = createEntityFetcher(
    Requests.actions.Activities.LoadActivitiesForProject,
    toActivities,
    storeActivities,
    api.Activity.fetchAllForProject,
    checkIfAllActivitiesLoadedForProject,
  );

  function* checkIfAllActivitiesLoadedForProject(
    id: string,
    response: ApiEntityResponse,
    count: number,
    _until?: number,
  ): IterableIterator<Effect> {
    if ((response.data as ApiEntity[]).length < count) {
      yield put(Requests.actions.allActivitiesRequestedForProject(id));
    }
  }

  function* watchForLoadActivities(): IterableIterator<Effect> {
    while (true) {
      const action = yield take(LOAD_ACTIVITIES);
      // Block until it's done, skipping any further actions
      yield call(loadActivities, action);
    }
  }

  return {
    functions: {
      loadActivities,
      loadActivitiesForProject,
      checkIfAllActivitiesLoaded,
      checkIfAllActivitiesLoadedForProject,
      fetchActivities,
      fetchActivitiesForProject,
      ensureActivitiesRelatedDataLoaded,
    },
    sagas: [
      throttle(200, LOAD_ACTIVITIES_FOR_PROJECT, loadActivitiesForProject),
      fork(watchForLoadActivities, loadActivities),
    ],
  };
}
