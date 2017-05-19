import { Action } from 'redux';
import { call, Effect, fork, put, select, take } from 'redux-saga/effects';

import * as Converter from '../api/convert';
import { ApiEntity, ApiEntityResponse, ApiEntityTypeString, ApiResult } from '../api/types';
import Activities, { Activity } from '../modules/activities';
import Branches, { Branch } from '../modules/branches';
import Comments, { Comment } from '../modules/comments';
import Commits, { Commit } from '../modules/commits';
import Deployments, { Deployment } from '../modules/deployments';
import { FetchError, isFetchError } from '../modules/errors';
import Projects, { Project } from '../modules/projects';
import Requests, { CollectionActionCreators, FetchEntityActionCreators } from '../modules/requests';
import { StateTree } from '../reducers';

type SelectorResponse = Commit | Comment | Project | Deployment | Branch | Activity | FetchError | undefined;
type EntityType = Activity | Commit | Project | Deployment | Branch | Comment;

interface LoadEntityAction extends Action {
  id: string;
}

interface StoreEntityAction extends Action {
  entities: EntityType[];
}

/**
 * Loaders call fetchers if the entity doesn't exist and then ensures any related
 * data also exists.
 */
export const createLoader = (
  selector: (state: StateTree, id: string) => SelectorResponse,
  fetcher: (id: string) => IterableIterator<Effect>,
  dataEnsurer: (id: string) => IterableIterator<Effect | Effect[]>,
) => {
  return function* entityLoader(action: LoadEntityAction): IterableIterator<Effect> {
    const { id } = action;
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

/**
 * Fetchers handle fetching of the entity from the API, dispatching the
 * appropriate Requests actions, storing any included entities and performing
 * optional post-store actions.
 *
 * Returns true or false depending on whether the fetch succeeded or not.
 */
export const createEntityFetcher = <ApiParams>(
  requestActionCreators: FetchEntityActionCreators,
  converter: (apiEntities: ApiEntity[] | ApiEntity) => EntityType[],
  storeEntitiesActionCreator: (entities: EntityType[]) => StoreEntityAction,
  apiFetchFunction: (id: string, ...args: ApiParams[]) => Promise<ApiResult<ApiEntityResponse>>,
  postStoreEffects?: (id: string, response: ApiEntityResponse, ...args: ApiParams[]) => IterableIterator<Effect>,
) => {
  return function* entityFetcher(id: string, ...args: ApiParams[]): IterableIterator<Effect> {
    yield put(requestActionCreators.REQUEST.actionCreator(id));

    const { response, error, details, unauthorized }: {
      response?: ApiEntityResponse,
      error?: string,
      details?: string,
      unauthorized?: boolean,
    } = yield (call as any)(apiFetchFunction, id, ...args); // TODO: fix typings

    if (response) {
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

      return true;
    } else {
      yield put(requestActionCreators.FAILURE.actionCreator(id, error!, details, unauthorized));

      return false;
    }
  };
};

/**
 * Collection fetchers are fetchers that get all the available entities
 * of the desired type for the team, e.g. all projects.
 */
export const createCollectionFetcher = <ApiParams>(
  requestActionCreators: CollectionActionCreators,
  converter: (apiEntities: ApiEntity[] | ApiEntity) => EntityType[],
  storeEntitiesActionCreator: (entities: EntityType[]) => StoreEntityAction,
  apiFetchFunction: (teamId: string, ...args: ApiParams[]) => Promise<ApiResult<ApiEntityResponse>>,
  postStoreEffects?: (response: ApiEntityResponse, ...args: ApiParams[]) => IterableIterator<Effect>,
) => {
  return function* collectionFetcher(teamId: string, ...args: ApiParams[]): IterableIterator<Effect> {
    yield put(requestActionCreators.REQUEST.actionCreator());

    const { response, error, details, unauthorized }: {
      response?: ApiEntityResponse,
      error?: string,
      details?: string,
      unauthorized?: boolean,
    } = yield (call as any)(apiFetchFunction, teamId, ...args); // TODO: fix typings

    if (response) {
      if (response.included) {
        yield call(storeIncludedEntities, response.included);
      }

      const entities = yield call(converter, response.data);
      yield put(storeEntitiesActionCreator(entities));

      if (postStoreEffects) {
        yield* postStoreEffects(response, ...args);
      }

      yield put(requestActionCreators.SUCCESS.actionCreator());

      return true;
    } else {
      yield put(requestActionCreators.FAILURE.actionCreator(error!, details, unauthorized));

      return false;
    }
  };
};

const storingMetadata: {
  type: ApiEntityTypeString,
  storeActionCreator: (entities: EntityType[]) => StoreEntityAction,
  converter: (apiEntities: ApiEntity[] | ApiEntity) => EntityType[],
}[] = [
  { type: 'projects', storeActionCreator: Projects.actions.storeProjects, converter: Converter.toProjects },
  { type: 'deployments', storeActionCreator: Deployments.actions.storeDeployments, converter: Converter.toDeployments },
  { type: 'comments', storeActionCreator: Comments.actions.storeComments, converter: Converter.toComments },
  { type: 'commits', storeActionCreator: Commits.actions.storeCommits, converter: Converter.toCommits },
  { type: 'branches', storeActionCreator: Branches.actions.storeBranches, converter: Converter.toBranches },
  { type: 'activities', storeActionCreator: Activities.actions.storeActivities, converter: Converter.toActivities },
];

export function* storeIncludedEntities(entities: ApiEntity[] | undefined): IterableIterator<Effect> {
  if (entities && entities.length > 0) {
    // Can't use forEach because of generators
    for (const currentType of storingMetadata) {
      const includedEntities = entities.filter(entity => entity.type === currentType.type);
      if (includedEntities.length > 0) {
        const objects = yield call(currentType.converter, includedEntities);
        yield put(currentType.storeActionCreator(objects));
      }
    }
  }
}

const selectors = {
  branches: Branches.selectors.getBranch,
  commits: Commits.selectors.getCommit,
  deployments: Deployments.selectors.getDeployment,
  projects: Projects.selectors.getProject,
};
const actions = {
  branches: { fetch: Branches.actions.fetchBranch, requests: Requests.actions.Branches.LoadBranch },
  commits: { fetch: Commits.actions.fetchCommit, requests: Requests.actions.Commits.LoadCommit },
  deployments: { fetch: Deployments.actions.fetchDeployment, requests: Requests.actions.Deployments.LoadDeployment },
  projects: { fetch: Projects.actions.fetchProject, requests: Requests.actions.Projects.LoadProject },
};

/**
 * Returns the entity object.
 */
export function* fetchIfMissing(type: ApiEntityTypeString, id: string): IterableIterator<Effect> {
  const selector = (selectors as any)[type];
  const entityActions = (actions as any)[type];

  let existingEntity = yield select(selector, id);

  if (!existingEntity || isFetchError(existingEntity)) {
    yield put(entityActions.fetch(id));
    // Wait until the entity has been fetched.
    yield take(
      (action: any) =>
        action.id === id &&
        [entityActions.requests.SUCCESS.type, entityActions.requests.FAILURE.type].indexOf(action.type) > -1,
    );
    existingEntity = yield select(selector, id);
  }

  return existingEntity;
}
