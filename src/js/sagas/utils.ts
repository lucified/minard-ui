import { Action } from 'redux';
import { Effect, call, fork, put, select } from 'redux-saga/effects';

import * as Converter from '../api/convert';
import { ApiEntity, ApiEntityTypeString, ApiPromise, ApiResponse } from '../api/types';
import Activities, { Activity } from '../modules/activities';
import Branches, { Branch } from '../modules/branches';
import Commits, { Commit } from '../modules/commits';
import Deployments, { Deployment } from '../modules/deployments';
import { FetchError } from '../modules/errors';
import Projects, { Project } from '../modules/projects';
import { CollectionActionCreators, FetchEntityActionCreators } from '../modules/requests';
import { StateTree } from '../reducers';

type SelectorResponse = Commit | Project | Deployment | Branch | Activity | FetchError | undefined;
type EntityType = Activity | Commit | Project | Deployment | Branch;

interface LoadEntityAction extends Action {
  id: string;
}

interface StoreEntityAction extends Action {
  entities: EntityType[];
}

export const createLoader = (
  selector: (state: StateTree, id: string) => SelectorResponse,
  fetcher: (id: string) => IterableIterator<Effect>,
  dataEnsurer: (id: string) => IterableIterator<Effect | Effect[]>
) => {
  return function* (action: LoadEntityAction): IterableIterator<Effect> { // tslint:disable-line:only-arrow-functions
    const id: string = action.id;
    const existingEntity = yield select(selector, id);
    let fetchSucceeded: boolean = false;

    if (!existingEntity) {
      fetchSucceeded = yield call(fetcher, id);
    }

    if (existingEntity || fetchSucceeded) {
      try {
        yield fork(dataEnsurer, id);
      } catch (e) {
        console.error('Error ensuring data exists:', e);
        // We need to not load 'raven-js' when running tests
        if (typeof window !== 'undefined') {
          const Raven = require('raven-js');
          if (Raven.isSetup()) {
            Raven.captureException(e, { extra: { action } });
          }
        }
      }
    }
  };
};

export const createEntityFetcher = <ResponseEntity, ApiParams>(
  requestActionCreators: FetchEntityActionCreators,
  converter: (apiEntities: ApiEntity[] | ApiEntity) => EntityType[],
  storeEntitiesActionCreator: (entities: EntityType[]) => StoreEntityAction,
  apiFetchFunction: (id: string, ...args: ApiParams[]) => ApiPromise,
  postStoreEffects?: (id: string, response: ApiResponse, ...args: ApiParams[]) => IterableIterator<Effect>,
) => {
  return function* (id: string, ...args: ApiParams[]): IterableIterator<Effect> { // tslint:disable-line
    yield put(requestActionCreators.REQUEST.actionCreator(id));

    const { response, error, details }: { response?: ApiResponse, error?: string, details?: string } =
      yield call(apiFetchFunction, id, ...args);

    if (response) {
      try {
        if (response.included) {
          yield call(storeIncludedEntities, response.included);
        }

        const entities = yield call(converter, response.data);
        if (entities && entities.length > 0) {
          yield put(storeEntitiesActionCreator(entities));
        }

        if (postStoreEffects) {
          yield* postStoreEffects(id, response, ...args);
        }

        yield put(requestActionCreators.SUCCESS.actionCreator(id));
      } catch (e) {
        console.error('Error storing new project', e);
        // We need to not load 'raven-js' when running tests
        if (typeof window !== 'undefined') {
          const Raven = require('raven-js');
          if (Raven.isSetup()) {
            Raven.captureException(e, { extra: { id, args, response } });
          }
        }

        return false;
      }

      return true;
    } else {
      yield put(requestActionCreators.FAILURE.actionCreator(id, error!, details));

      return false;
    }
  };
};

export const createCollectionFetcher = <ResponseEntity, ApiParams>(
  requestActionCreators: CollectionActionCreators,
  converter: (apiEntities: ApiEntity[] | ApiEntity) => EntityType[],
  storeEntitiesActionCreator: (entities: EntityType[]) => StoreEntityAction,
  apiFetchFunction: (...args: ApiParams[]) => ApiPromise,
  postStoreEffects?: (response: ApiResponse, ...args: ApiParams[]) => IterableIterator<Effect>,
) => {
  return function* (...args: ApiParams[]): IterableIterator<Effect> { // tslint:disable-line:only-arrow-functions
    yield put(requestActionCreators.REQUEST.actionCreator());

    const { response, error, details }: { response?: ApiResponse, error?: string, details?: string } =
      yield call(apiFetchFunction, ...args);

    if (response) {
      try {
        if (response.included) {
          yield call(storeIncludedEntities, response.included);
        }

        const entities = yield call(converter, response.data);
        yield put(storeEntitiesActionCreator(entities));

        if (postStoreEffects) {
          yield* postStoreEffects(response, ...args);
        }

        yield put(requestActionCreators.SUCCESS.actionCreator());
      } catch (e) {
        console.error('Error fetching collection', e);
        // We need to not load 'raven-js' when running tests
        if (typeof window !== 'undefined') {
          const Raven = require('raven-js');
          if (Raven.isSetup()) {
            Raven.captureException(e, { extra: { args, response } });
          }
        }

        return false;
      }

      return true;
    } else {
      yield put(requestActionCreators.FAILURE.actionCreator(error!, details));

      return false;
    }
  };
};

const storingMetadata: {
  type: ApiEntityTypeString,
  storeActionCreator: (entities: EntityType[]) => StoreEntityAction,
  converter: (apiEntities: ApiEntity[] | ApiEntity) => EntityType[],
}[] = [
  { type: 'projects', storeActionCreator: Projects.actions.storeProjects, converter: Converter.toProjects },
  { type: 'deployments', storeActionCreator: Deployments.actions.storeDeployments, converter: Converter.toDeployments },
  { type: 'commits', storeActionCreator: Commits.actions.storeCommits, converter: Converter.toCommits },
  { type: 'branches', storeActionCreator: Branches.actions.storeBranches, converter: Converter.toBranches },
  { type: 'activities', storeActionCreator: Activities.actions.storeActivities, converter: Converter.toActivities },
];

export function* storeIncludedEntities(entities: ApiEntity[] | undefined): IterableIterator<Effect> {
  if (entities && entities.length > 0) {
    // Can't use forEach because of generators
    for (let i = 0; i < storingMetadata.length; i++) {
      const currentType = storingMetadata[i];
      const includedEntities = entities.filter(entity => entity.type === currentType.type);
      if (includedEntities.length > 0) {
        const objects = yield call(currentType.converter, includedEntities);
        yield put(currentType.storeActionCreator(objects));
      }
    }
  }
};
