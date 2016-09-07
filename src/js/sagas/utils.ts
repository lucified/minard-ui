import { Action, ActionCreator } from 'redux';
import { Effect, call, fork, put, select } from 'redux-saga/effects';

import { ApiEntity, ApiEntityTypeString, ApiPromise } from '../api/types';
import Branches, { Branch } from '../modules/branches';
import Commits, { Commit } from '../modules/commits';
import Deployments, { Deployment } from '../modules/deployments';
import { FetchError } from '../modules/errors';
import Projects, { Project } from '../modules/projects';
import { RequestFetchActionCreators } from '../modules/types';
import { StateTree } from '../reducers';

type EntityType = Commit | Project | Deployment | Branch | FetchError;

interface FetchAction {
  type: string;
  id: string;
}

export const createLoader = (
  selector: (state: StateTree, id: string) => EntityType,
  fetcher: (id: string) => IterableIterator<Effect>,
  dataEnsurer: (id: string) => IterableIterator<Effect | Effect[]>
) => {
  return function* (action: FetchAction): IterableIterator<Effect> { // tslint:disable-line:only-arrow-functions
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

export const createFetcher = <R extends Action, ResponseEntity, S extends Action, F extends Action>(
  requestActionCreators: RequestFetchActionCreators<R, ResponseEntity, S, F>,
  apiFetchFunction: (id: string) => ApiPromise
) => {
  return function* (id: string): IterableIterator<Effect> { // tslint:disable-line:only-arrow-functions
    yield put(requestActionCreators.request(id));

    const { response, error, details } = yield call(apiFetchFunction, id);

    if (response) {
      if (response.included) {
        yield call(storeIncludedEntities, response.included);
      }

      yield put(requestActionCreators.success(id, response.data));

      return true;
    } else {
      yield put(requestActionCreators.failure(id, error, details));

      return false;
    }
  };
};

export function* storeIncludedEntities(entities: ApiEntity[] | undefined): IterableIterator<Effect> {
  const types: { type: ApiEntityTypeString, actionCreator: ActionCreator<any> }[] = [
    { type: 'projects', actionCreator: Projects.actions.storeProjects },
    { type: 'deployments', actionCreator: Deployments.actions.storeDeployments },
    { type: 'commits', actionCreator: Commits.actions.storeCommits },
    { type: 'branches', actionCreator: Branches.actions.storeBranches },
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
