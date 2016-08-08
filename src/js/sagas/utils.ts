import { ActionCreator } from 'redux';
import { Effect, call, fork, put, select } from 'redux-saga/effects';

import { ApiEntity, ApiEntityTypeString, ApiResponse } from '../api/types';
import Branches, { Branch } from '../modules/branches';
import Commits, { Commit } from '../modules/commits';
import Deployments, { Deployment } from '../modules/deployments';
import { FetchError } from '../modules/errors';
import Projects, { Project } from '../modules/projects';
import { StateTree } from '../reducers';

type EntityType = Commit | Project | Deployment | Branch | FetchError;
interface RequestActionCreators {
  request: ActionCreator<any>;
  success: ActionCreator<any>;
  failure: ActionCreator<any>;
}

export const createLoader = (
  selector: (state: StateTree, id: string) => EntityType,
  fetcher: (id: string) => IterableIterator<Effect>,
  dataEnsurer: (id: string) => IterableIterator<Effect | Effect[]>
) => {
  return function* (id: string): IterableIterator<Effect> {
    const existingEntity = yield select(selector, id);
    let fetchSucceeded: boolean;

    if (!existingEntity) {
      fetchSucceeded = yield call(fetcher, id);
    }

    if (existingEntity || fetchSucceeded) {
      yield fork(dataEnsurer, id);
    }
  };
};

export const createFetcher = (
  requestActionCreators: RequestActionCreators,
  apiFetchFunction: (id: string) => Promise<{ response: ApiResponse } | { error: string }>
) => {
  return function* (id: string): IterableIterator<Effect> {
    yield put(requestActionCreators.request(id));

    const { response, error } = yield call(apiFetchFunction, id);

    if (response) {
      if (response.included) {
        yield call(storeIncludedEntities, response.included);
      }

      yield put(requestActionCreators.success(id, response.data));

      return true;
    } else {
      yield put(requestActionCreators.failure(id, error));

      return false;
    }
  };
};

export function* storeIncludedEntities(entities: ApiEntity[]): IterableIterator<Effect> {
  const types: { type: ApiEntityTypeString, actionCreator: ActionCreator<any> }[] = [
    { type: 'projects', actionCreator: Projects.actions.StoreProjects },
    { type: 'deployments', actionCreator: Deployments.actions.StoreDeployments },
    { type: 'commits', actionCreator: Commits.actions.StoreCommits },
    { type: 'branches', actionCreator: Branches.actions.StoreBranches },
  ];

  if (entities && entities.length > 0) {
    // Can't use forEach because of generators
    for (let i = 0; i < types.length; i++) {
      const currentType = types[i];
      const includedEntities = entities.filter(entity => entity.type === currentType.type);
      if (includedEntities.length > 0) {
        yield put(currentType.actionCreator(includedEntities));
      }
    }
  }
};
