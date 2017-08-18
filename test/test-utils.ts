// tslint:disable:no-object-literal-type-assertion

// NOTE: This file needs to be at the same level in this level of the project
// becase of the JSON requires below and compiled-test.

import { expect } from 'chai';
import { Action } from 'redux';
import { call, Effect, fork, put, select } from 'redux-saga/effects';

import {
  Api,
  ApiEntityResponse,
  ApiResult,
  ApiTeam,
} from '../src/js/api/types';
import { Branch } from '../src/js/modules/branches';
import { Commit } from '../src/js/modules/commits';
import { Deployment } from '../src/js/modules/deployments';
import { FetchError } from '../src/js/modules/errors';
import { Project } from '../src/js/modules/projects';
import { FetchEntityActionCreators } from '../src/js/modules/requests';
import { StateTree } from '../src/js/reducers';
import { storeIncludedEntities } from '../src/js/sagas/utils';

export const testData = {
  allProjectsResponse: require('../json/projects.json') as ApiEntityResponse,
  deploymentResponse: require('../json/deployment-7.json') as ApiEntityResponse,
  branchResponse: require('../json/branch-1.json') as ApiEntityResponse,
  commitResponse: require('../json/commit.json') as ApiEntityResponse,
  projectResponse: require('../json/project-1.json') as ApiEntityResponse,
  activitiesResponse: require('../json/activities.json') as ApiEntityResponse,
  projectBranchesResponse: require('../json/project-1-branches.json') as ApiEntityResponse,
  branchCommitsResponse: require('../json/branch-1-commits.json') as ApiEntityResponse,
};

export function createApi(): Api {
  const emptyResponse = { response: {} as any };
  return {
    Activity: {
      fetchAll: () => Promise.resolve(emptyResponse),
      fetchAllForProject: (_id: string) => Promise.resolve(emptyResponse),
    },
    Branch: {
      fetch: (_id: string) => Promise.resolve(emptyResponse),
      fetchForProject: (_id: string) => Promise.resolve(emptyResponse),
    },
    Comment: {
      fetchForDeployment: (_id: string) => Promise.resolve(emptyResponse),
      create: (
        _deployment: string,
        _message: string,
        _email: string,
        _name: string,
      ) => Promise.resolve(emptyResponse),
      delete: (_id: string) => Promise.resolve({ response: {} }),
    },
    Commit: {
      fetch: (_id: string) => Promise.resolve(emptyResponse),
      fetchForBranch: (_id: string) => Promise.resolve(emptyResponse),
    },
    Deployment: {
      fetch: (_id: string) => Promise.resolve(emptyResponse),
      fetchBuildLog: (_id: string) => Promise.resolve({ response: '' }),
    },
    Notification: {
      delete: (_id: string) => Promise.resolve({ response: {} }),
    },
    Preview: {
      fetch: (_id: string) => Promise.resolve(emptyResponse),
    },
    Project: {
      fetchAll: () => Promise.resolve(emptyResponse),
      fetch: (_id: string) => Promise.resolve(emptyResponse),
      fetchNotifications: (_id: string) => Promise.resolve(emptyResponse),
      createNotification: () => Promise.resolve(emptyResponse),
      create: (_name: string, _description?: string) =>
        Promise.resolve(emptyResponse),
      edit: (
        _id: string,
        _newAttributes: { description?: string; name?: string },
      ) => Promise.resolve(emptyResponse),
      delete: (_id: string) => Promise.resolve({ response: {} }),
    },
    Team: {
      fetch: () =>
        Promise.resolve({ response: { id: 1, name: 'name' } as ApiTeam }),
      fetchNotifications: (_id: string) => Promise.resolve(emptyResponse),
    },
    User: {
      signup: () =>
        Promise.resolve({
          response: {
            password: 'secretPass',
            team: { id: 1, name: 'name' } as ApiTeam,
          },
        }),
      logout: () => Promise.resolve({ response: {} }),
    },
  };
}

export function testLoaderSaga(
  name: string,
  loader: (action: any) => IterableIterator<Effect>,
  selector: (
    state: StateTree,
    id: string,
  ) => Branch | Commit | Deployment | Project | FetchError | undefined,
  fetcher: (id: string) => IterableIterator<Effect>,
  ensurer: (id: string) => IterableIterator<Effect | Effect[]>,
) {
  describe(name, () => {
    const id = 'id';
    const action = {
      type: 'foo',
      id,
    };

    it('fetches the entity and ensures data if it does not exist', () => {
      const iterator = loader(action);

      expect(iterator.next().value).to.deep.equal(select(selector, id));

      expect(iterator.next().value).to.deep.equal(call(fetcher, id));

      expect(iterator.next(true).value).to.deep.equal(fork(ensurer, id));

      expect(iterator.next().done).to.equal(true);
    });

    it('does not ensure data if fetching fails', () => {
      const iterator = loader(action);

      expect(iterator.next().value).to.deep.equal(select(selector, id));

      expect(iterator.next().value).to.deep.equal(call(fetcher, id));

      expect(iterator.next(false).done).to.equal(true);
    });

    it('still ensures data even if entity already exists', () => {
      const iterator = loader(action);

      expect(iterator.next().value).to.deep.equal(select(selector, id));

      expect(iterator.next({ id }).value).to.deep.equal(fork(ensurer, id));

      expect(iterator.next().done).to.equal(true);
    });
  });
}

interface StoreAction extends Action {
  entities: any[];
}

export function testEntityFetcherSaga<ApiParams>(
  name: string,
  response: ApiEntityResponse,
  responseNoInclude: ApiEntityResponse,
  requestActionCreators: FetchEntityActionCreators,
  fetcher: (id: string, ...args: ApiParams[]) => IterableIterator<Effect>,
  apiCall: (id: string) => Promise<ApiResult<ApiEntityResponse>>,
  converter: (responseEntities: any[]) => any[],
  storeActionCreator: (entities: any[]) => StoreAction,
) {
  describe(name, () => {
    const id = 'id';

    it('fetches, converts and stores entity', () => {
      const iterator = fetcher(id);
      const objectsToStore = [{ id: '1' }, { id: '2' }];

      expect(iterator.next().value).to.deep.equal(
        put(requestActionCreators.REQUEST.actionCreator(id)),
      );

      expect(iterator.next().value).to.deep.equal(call(apiCall, id));

      expect(
        iterator.next({ response: responseNoInclude }).value,
      ).to.deep.equal(call(converter as any, responseNoInclude.data));

      expect(iterator.next(objectsToStore).value).to.deep.equal(
        put(storeActionCreator(objectsToStore)),
      );

      expect(iterator.next().value).to.deep.equal(
        put(requestActionCreators.SUCCESS.actionCreator(id)),
      );

      const endResult = iterator.next();
      expect(endResult.done).to.equal(true);
      expect(endResult.value).to.equal(true);
    });

    it('fetches and stores included data', () => {
      const iterator = fetcher(id);

      expect(iterator.next().value).to.deep.equal(
        put(requestActionCreators.REQUEST.actionCreator(id)),
      );

      expect(iterator.next().value).to.deep.equal(call(apiCall, id));

      if (response.included && response.included.length > 0) {
        expect(iterator.next({ response }).value).to.deep.equal(
          call(storeIncludedEntities, response.included),
        );
      }
    });

    it('throws an error on failure', () => {
      const errorMessage = 'an error message';
      const details = 'a detailed error message';
      const iterator = fetcher(id);

      expect(iterator.next().value).to.deep.equal(
        put(requestActionCreators.REQUEST.actionCreator(id)),
      );

      expect(iterator.next().value).to.deep.equal(call(apiCall, id));

      expect(
        iterator.next({ error: errorMessage, details }).value,
      ).to.deep.equal(
        put(
          requestActionCreators.FAILURE.actionCreator(
            id,
            errorMessage,
            details,
          ),
        ),
      );

      const endResult = iterator.next();

      expect(endResult.done).to.equal(true);
      expect(endResult.value).to.equal(false);
    });
  });
}
