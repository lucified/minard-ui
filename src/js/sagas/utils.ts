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
      yield fork(dataEnsurer, id);
    }
  };
};

export const createEntityFetcher = <ResponseEntity>(
  requestActionCreators: FetchEntityActionCreators,
  converter: (apiEntities: ApiEntity[] | ApiEntity) => EntityType[],
  storeEntitiesActionCreator: (entities: EntityType[]) => StoreEntityAction,
  apiFetchFunction: (id: string) => ApiPromise
) => {
  return function* (id: string): IterableIterator<Effect> { // tslint:disable-line:only-arrow-functions
    yield put(requestActionCreators.REQUEST.actionCreator(id));

    const { response, error, details }: { response?: ApiResponse, error?: string, details?: string } =
      yield call(apiFetchFunction, id);

    if (response) {
      yield put(requestActionCreators.SUCCESS.actionCreator(id));

      if (response.included) {
        yield call(storeIncludedEntities, response.included);
      }

      const entities = yield call(converter, response.data);
      yield put(storeEntitiesActionCreator(entities));

      return true;
    } else {
      yield put(requestActionCreators.FAILURE.actionCreator(id, error!, details));

      return false;
    }
  };
};

export const createCollectionFetcher = <ResponseEntity>(
  requestActionCreators: CollectionActionCreators,
  converter: (apiEntities: ApiEntity[] | ApiEntity) => EntityType[],
  storeEntitiesActionCreator: (entities: EntityType[]) => StoreEntityAction,
  apiFetchFunction: () => ApiPromise
) => {
  return function* (): IterableIterator<Effect> { // tslint:disable-line:only-arrow-functions
    yield put(requestActionCreators.REQUEST.actionCreator());

    const { response, error, details }: { response?: ApiResponse, error?: string, details?: string } =
      yield call(apiFetchFunction);

    if (response) {
      yield put(requestActionCreators.SUCCESS.actionCreator());

      if (response.included) {
        yield call(storeIncludedEntities, response.included);
      }

      const entities = yield call(converter, response.data);
      yield put(storeEntitiesActionCreator(entities));

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
      const objects = yield call(currentType.converter, includedEntities);
      if (includedEntities.length > 0) {
        yield put(currentType.storeActionCreator(objects));
      }
    }
  }
};
