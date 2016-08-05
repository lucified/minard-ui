import { expect } from 'chai';
import { merge } from 'lodash';
import { ActionCreator } from 'redux';
import { Effect, call, fork, put, select, take } from 'redux-saga/effects';

import { Api, ApiEntityTypeString, ApiPromise, ApiResponse } from '../src/js/api/types';
import Branches, { Branch } from '../src/js/modules/branches';
import Commits, { Commit } from '../src/js/modules/commits';
import Deployments, { Deployment } from '../src/js/modules/deployments';
import Projects, { Project } from '../src/js/modules/projects';
import { StateTree } from '../src/js/reducers';
import sagaCreator from '../src/js/sagas';

import * as testData from './test-data';

interface CreateApiParameter {
  fetchCommit?: (id: string) => ApiPromise;
  fetchBranch?: (id: string) => ApiPromise;
  fetchDeployment?: (id: string) => ApiPromise;
  fetchProject?: (id: string) => ApiPromise;
  fetchAllProjects?: () => ApiPromise;
}

const createApi = (functionsToReplace?: CreateApiParameter): Api => {
  const defaultFunctions: Api = {
    fetchCommit: (_) => Promise.resolve({ response: {} }),
    fetchBranch: (_) => Promise.resolve({ response: {} }),
    fetchDeployment: (_) => Promise.resolve({ response: {} }),
    fetchProject: (_) => Promise.resolve({ response: {} }),
    fetchAllProjects: () => Promise.resolve({ response: {} }),
  };

  return merge(defaultFunctions, functionsToReplace);
};

// TODO: Test activitiy-related sagas

describe('sagas', () => {
  const api = createApi();
  const sagas = sagaCreator(api);

  const testWatcher = (
    name: string,
    action: string,
    iterator: IterableIterator<Effect>,
    loader: (id: string) => IterableIterator<Effect>
  ) => {
    describe(name, () => {
      it(`forks a new saga on ${action}`, () => {
        const id = 'id';

        expect(iterator.next().value).to.deep.equal(
          take(action)
        );

        expect(iterator.next({ id }).value).to.deep.equal(
          fork(loader, id)
        );
      });
    });
  };

  testWatcher(
    'watchForLoadDeployment',
    Deployments.actions.LOAD_DEPLOYMENT,
    sagas.watchForLoadDeployment(),
    sagas.loadDeployment
  );

  testWatcher(
    'watchForLoadBranch',
    Branches.actions.LOAD_BRANCH,
    sagas.watchForLoadBranch(),
    sagas.loadBranch,
  );

  testWatcher(
    'watchForLoadProject',
    Projects.actions.LOAD_PROJECT,
    sagas.watchForLoadProject(),
    sagas.loadProject,
  );

  testWatcher(
    'watchForLoadCommit',
    Commits.actions.LOAD_COMMIT,
    sagas.watchForLoadCommit(),
    sagas.loadCommit,
  );

  describe('watchForLoadAllProjects', () => {
    it(`forks a new saga on ${Projects.actions.LOAD_ALL_PROJECTS}`, () => {
      const iterator = sagas.watchForLoadAllProjects();

      expect(iterator.next().value).to.deep.equal(
        take(Projects.actions.LOAD_ALL_PROJECTS)
      );

      expect(iterator.next().value).to.deep.equal(
        fork(sagas.fetchAllProjects)
      );
    });
  });

  const testLoader = (
    name: string,
    loader: (id: string) => IterableIterator<Effect>,
    selector: (state: StateTree, id: string) => Branch | Commit | Deployment | Project,
    fetcher: (id: string) => IterableIterator<Effect>,
    ensurer: (id: string) => IterableIterator<Effect | Effect[]>,
  ) => {
    describe(name, () => {
      const id = 'id';

      it('fetches the entity and ensures data if it does not exist', () => {
        const iterator = loader(id);

        expect(iterator.next().value).to.deep.equal(
          select(selector, id)
        );

        expect(iterator.next().value).to.deep.equal(
          call(fetcher, id)
        );

        expect(iterator.next(true).value).to.deep.equal(
          fork(ensurer, id)
        );

        expect(iterator.next().done).to.equal(true);
      });

      it('does not ensure data if fetching fails', () => {
        const iterator = loader(id);

        expect(iterator.next().value).to.deep.equal(
          select(selector, id)
        );

        expect(iterator.next().value).to.deep.equal(
          call(fetcher, id)
        );

        expect(iterator.next(false).done).to.equal(true);
      });

      it('it still ensures data even if entity already exists', () => {
        const iterator = loader(id);

        expect(iterator.next().value).to.deep.equal(
          select(selector, id)
        );

        expect(iterator.next({ id }).value).to.deep.equal(
          fork(ensurer, id)
        );

        expect(iterator.next().done).to.equal(true);
      });
    });
  };

  testLoader(
    'loadBranch',
    sagas.loadBranch,
    Branches.selectors.getBranch,
    sagas.fetchBranch,
    sagas.ensureBranchRelatedDataLoaded,
  );

  testLoader(
    'loadDeployment',
    sagas.loadDeployment,
    Deployments.selectors.getDeployment,
    sagas.fetchDeployment,
    sagas.ensureDeploymentRelatedDataLoaded,
  );

  testLoader(
    'loadCommit',
    sagas.loadCommit,
    Commits.selectors.getCommit,
    sagas.fetchCommit,
    sagas.ensureCommitRelatedDataLoaded,
  );

  testLoader(
    'loadProject',
    sagas.loadProject,
    Projects.selectors.getProject,
    sagas.fetchProject,
    sagas.ensureProjectRelatedDataLoaded,
  );

  interface RequestActionCreators {
    request: ActionCreator<any>;
    success: ActionCreator<any>;
    failure: ActionCreator<any>;
  }

  const testFetcher = (
    name: string,
    response: ApiResponse,
    responseNoInclude: ApiResponse,
    requestActionCreators: RequestActionCreators,
    fetcher: (id: string) => IterableIterator<Effect>,
    apiCall: (id: string) => ApiPromise,
  ) => {
    describe(name, () => {
      const id = 'id';

      it('fetches and stores entity', () => {
        const iterator = fetcher(id);

        expect(iterator.next().value).to.deep.equal(
          put(requestActionCreators.request(id))
        );

        expect(iterator.next().value).to.deep.equal(
          call(apiCall, id)
        );

        expect(iterator.next({ response: responseNoInclude }).value).to.deep.equal(
          put(requestActionCreators.success(id, responseNoInclude.data))
        );

        expect(iterator.next().done).to.equal(true);
      });

      it('fetches and stores included data', () => {
        const iterator = fetcher(id);

        expect(iterator.next().value).to.deep.equal(
          put(requestActionCreators.request(id))
        );

        expect(iterator.next().value).to.deep.equal(
          call(apiCall, id)
        );

        expect(iterator.next({ response: response }).value).to.deep.equal(
          call(sagas.storeIncludedEntities, response.included)
        );

        expect(iterator.next().value).to.deep.equal(
          put(requestActionCreators.success(id, response.data))
        );

        expect(iterator.next().done).to.equal(true);
      });

      it('throws an error on failure', () => {
        const errorMessage = 'an error message';
        const iterator = fetcher(id);

        expect(iterator.next().value).to.deep.equal(
          put(requestActionCreators.request(id))
        );

        expect(iterator.next().value).to.deep.equal(
          call(apiCall, id)
        );

        expect(iterator.next({ error: errorMessage }).value).to.deep.equal(
          put(requestActionCreators.failure(id, errorMessage))
        );

        expect(iterator.next().done).to.equal(true);
      });
    });
  };

  testFetcher(
    'fetchDeployment',
    testData.deploymentResponse,
    testData.deploymentResponseNoInclude,
    Deployments.actions.FetchDeployment,
    sagas.fetchDeployment,
    api.fetchDeployment
  );

  testFetcher(
    'fetchBranch',
    testData.branchResponse,
    testData.branchResponseNoInclude,
    Branches.actions.FetchBranch,
    sagas.fetchBranch,
    api.fetchBranch,
  );

  testFetcher(
    'fetchCommit',
    testData.commitResponse,
    testData.commitResponseNoInclude,
    Commits.actions.FetchCommit,
    sagas.fetchCommit,
    api.fetchCommit,
  );

  testFetcher(
    'fetchProject',
    testData.projectResponse,
    testData.projectResponseNoInclude,
    Projects.actions.FetchProject,
    sagas.fetchProject,
    api.fetchProject,
  );

  describe('fetchAllProjects', () => {
    it('fetches and stores all projects', () => {
      const response = testData.projectsResponseNoInclude;
      const iterator = sagas.fetchAllProjects();

      expect(iterator.next().value).to.deep.equal(
        put(Projects.actions.FetchAllProjects.request())
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.fetchAllProjects)
      );

      expect(iterator.next({ response: response }).value).to.deep.equal(
        put(Projects.actions.FetchAllProjects.success(response.data))
      );

      expect(iterator.next().value).to.deep.equal(
        fork(sagas.ensureAllProjectsRelatedDataLoaded)
      );

      expect(iterator.next().done).to.equal(true);
    });

    it('fetches and stores included data', () => {
      const response = testData.projectsResponse;
      const iterator = sagas.fetchAllProjects();

      expect(iterator.next().value).to.deep.equal(
        put(Projects.actions.FetchAllProjects.request())
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.fetchAllProjects)
      );

      expect(iterator.next({ response: response }).value).to.deep.equal(
        call(sagas.storeIncludedEntities, response.included)
      );

      expect(iterator.next().value).to.deep.equal(
        put(Projects.actions.FetchAllProjects.success(response.data))
      );

      expect(iterator.next().value).to.deep.equal(
        fork(sagas.ensureAllProjectsRelatedDataLoaded)
      );

      expect(iterator.next().done).to.equal(true);
    });

    it('throws an error on failure', () => {
      const errorMessage = 'an error message';
      const iterator = sagas.fetchAllProjects();

      expect(iterator.next().value).to.deep.equal(
        put(Projects.actions.FetchAllProjects.request())
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.fetchAllProjects)
      );

      expect(iterator.next({ error: errorMessage }).value).to.deep.equal(
        put(Projects.actions.FetchAllProjects.failure(errorMessage))
      );

      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('ensureAllProjectsRelatedDataLoaded', () => {
    it('makes sure branches and first deployments exist for all projects', () => {
      const iterator = sagas.ensureAllProjectsRelatedDataLoaded();
      const projects: Project[] = [
        {
          id: '1',
          name: 'name',
          branches: ['1', '2'],
          activeUsers: [],
        },
        {
          id: '2',
          name: 'name2',
          branches: ['3'],
          activeUsers: [],
        },
      ];
      const branches: {[id: string]: Branch} = {
        '1': {
          id: 'a',
          name: 'brancha',
          project: '1',
          commits: [],
          deployments: ['d1'],
        },
        '2': {
          id: 'b',
          name: 'branchb',
          project: '1',
          commits: [],
          deployments: [],
        },
        '3': {
          id: 'c',
          name: 'branchc',
          project: '2',
          commits: [],
          deployments: ['d2', 'd3', 'd4'],
        },
      };

      expect(iterator.next().value).to.deep.equal(
        select(Projects.selectors.getProjects)
      );

      expect(iterator.next(projects).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'branches', '1'),
          call(sagas.fetchIfMissing, 'branches', '2'),
        ]
      );

      expect(iterator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, '1')
      );

      expect(iterator.next(branches['1']).value).to.deep.equal(
        select(Branches.selectors.getBranch, '2')
      );

      expect(iterator.next(branches['2']).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'branches', '3'),
        ]
      );

      expect(iterator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, '3')
      );

      expect(iterator.next(branches['3']).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'deployments', 'd1'),
          call(sagas.fetchIfMissing, 'deployments', 'd2'),
        ]
      );

      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('ensureProjectRelatedDataLoaded', () => {
    it('makes sure branches and all deployments exist for the project', () => {
      const id = '1';
      const iterator = sagas.ensureProjectRelatedDataLoaded(id);
      const project: Project = {
        id: '1',
        name: 'name',
        branches: ['1', '2', '3'],
        activeUsers: [],
      };
      const branches: {[id: string]: Branch} = {
        '1': {
          id: 'a',
          name: 'brancha',
          project: '1',
          commits: [],
          deployments: ['d1'],
        },
        '2': {
          id: 'b',
          name: 'branchb',
          project: '1',
          commits: [],
          deployments: [],
        },
        '3': {
          id: 'c',
          name: 'branchc',
          project: '1',
          commits: [],
          deployments: ['d2', 'd3', 'd4'],
        },
      };

      expect(iterator.next().value).to.deep.equal(
        select(Projects.selectors.getProject, id)
      );

      expect(iterator.next(project).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'branches', '1'),
          call(sagas.fetchIfMissing, 'branches', '2'),
          call(sagas.fetchIfMissing, 'branches', '3'),
        ]
      );

      expect(iterator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, '1')
      );

      expect(iterator.next(branches['1']).value).to.deep.equal(
        select(Branches.selectors.getBranch, '2')
      );

      expect(iterator.next(branches['2']).value).to.deep.equal(
        select(Branches.selectors.getBranch, '3')
      );

      expect(iterator.next(branches['3']).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'deployments', 'd1'),
          call(sagas.fetchIfMissing, 'deployments', 'd2'),
          call(sagas.fetchIfMissing, 'deployments', 'd3'),
          call(sagas.fetchIfMissing, 'deployments', 'd4'),
        ]
      );

      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('ensureBranchRelatedDataLoaded', () => {
    it('makes sure commits and deployments exist for the branch', () => {
      const id = '1';
      const iterator = sagas.ensureBranchRelatedDataLoaded(id);
      const branch: Branch = {
        id: 'a',
        name: 'brancha',
        project: '1',
        commits: ['c1', 'c2', 'c3'],
        deployments: ['d1'],
      };

      expect(iterator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, id)
      );

      expect(iterator.next(branch).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'deployments', 'd1'),
        ]
      );

      expect(iterator.next().value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'commits', 'c1'),
          call(sagas.fetchIfMissing, 'commits', 'c2'),
          call(sagas.fetchIfMissing, 'commits', 'c3'),
        ]
      );

      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('ensureDeploymentRelatedDataLoaded', () => {
    it('makes sure commit exists for the deployment', () => {
      const id = '1';
      const iterator = sagas.ensureDeploymentRelatedDataLoaded(id);
      const deployment: Deployment = {
        id: 'a',
        commit: 'c1',
        url: '',
        screenshot: '',
        creator: {
          email: '',
          timestamp: 1,
        },
      };

      expect(iterator.next().value).to.deep.equal(
        select(Deployments.selectors.getDeployment, id)
      );

      expect(iterator.next(deployment).value).to.deep.equal(
        call(sagas.fetchIfMissing, 'commits', 'c1')
      );

      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('ensureCommitRelatedDataLoaded', () => {
    it('makes sure commit exists for the Commit', () => {
      const id = '1';
      const iterator = sagas.ensureCommitRelatedDataLoaded(id);
      const commit: Commit = {
        id: 'id',
        hash: 'a',
        deployment: 'd1',
        message: '',
        author: {
          email: '',
          timestamp: 1,
        },
        commiter: {
          email: '',
          timestamp: 1,
        },
      };

      expect(iterator.next().value).to.deep.equal(
        select(Commits.selectors.getCommit, id)
      );

      expect(iterator.next(commit).value).to.deep.equal(
        call(sagas.fetchIfMissing, 'deployments', 'd1')
      );

      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('fetchIfMissing', () => {
    const testFetchIfMissing = (
      type: ApiEntityTypeString,
      selector: (state: StateTree, id: string) => Branch | Commit | Deployment | Project,
      fetcher: (id: string) => IterableIterator<Effect>,
    ) => {
      it(`fetches missing ${type}`, () => {
        const id = '1';
        const iterator = sagas.fetchIfMissing(type, id);

        expect(iterator.next().value).to.deep.equal(
          select(selector, id)
        );

        expect(iterator.next().value).to.deep.equal(
          call(fetcher, id)
        );

        expect(iterator.next().done).to.equal(true);
      });
    };

    testFetchIfMissing('commits', Commits.selectors.getCommit, sagas.fetchCommit);
    testFetchIfMissing('deployments', Deployments.selectors.getDeployment, sagas.fetchDeployment);
    testFetchIfMissing('projects', Projects.selectors.getProject, sagas.fetchProject);
    testFetchIfMissing('branches', Branches.selectors.getBranch, sagas.fetchBranch);

    it('does not fetch already existing data', () => {
      const id = '1';
      const iterator = sagas.fetchIfMissing('commits', id);

      expect(iterator.next().value).to.deep.equal(
        select(Commits.selectors.getCommit, id)
      );

      expect(iterator.next({ id }).done).to.equal(true);
    });
  });

  describe('storeIncludedEntities', () => {
    it('stores passed entities', () => {
      const response = testData.branchResponse;
      const iterator = sagas.storeIncludedEntities(response.included);
      const deploymentsEntities = response.included.filter(entity => entity.type === 'deployments');
      const commitsEntities = response.included.filter(entity => entity.type === 'commits');

      expect(iterator.next().value).to.deep.equal(
        put(Deployments.actions.StoreDeployments(deploymentsEntities))
      );

      expect(iterator.next().value).to.deep.equal(
        put(Commits.actions.StoreCommits(commitsEntities))
      );

      expect(iterator.next().done).to.equal(true);
    });

    it('handles an empty included section', () => {
      const iteratorUndefined = sagas.storeIncludedEntities(undefined);
      expect(iteratorUndefined.next().done).to.equal(true);

      const iteratorEmptyArray = sagas.storeIncludedEntities([]);
      expect(iteratorEmptyArray.next().done).to.equal(true);
    });
  });
});
