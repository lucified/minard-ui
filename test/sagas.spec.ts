import { expect } from 'chai';
import { merge } from 'lodash';
import { call, fork, put, select, take } from 'redux-saga/effects';

import { Api, ApiPromise } from '../src/js/api/types';
import Branches, { Branch } from '../src/js/modules/branches';
import Commits, { Commit } from '../src/js/modules/commits';
import Deployments, { Deployment } from '../src/js/modules/deployments';
import Projects, { Project } from '../src/js/modules/projects';
import sagaCreator from '../src/js/sagas';

import * as testData from './test-data';

interface CreateApiParameter {
  fetchCommit?: (id: string) => ApiPromise;
  fetchBranch?: (id: string) => ApiPromise;
  fetchDeployment?: (id: string) => ApiPromise;
  fetchProject?: (id: string) => ApiPromise;
  fetchProjects?: () => ApiPromise;
}

const createApi = (functionsToReplace?: CreateApiParameter): Api => {
  const defaultFunctions: Api = {
    fetchCommit: (_) => Promise.resolve({ response: {} }),
    fetchBranch: (_) => Promise.resolve({ response: {} }),
    fetchDeployment: (_) => Promise.resolve({ response: {} }),
    fetchProject: (_) => Promise.resolve({ response: {} }),
    fetchProjects: () => Promise.resolve({ response: {} }),
  };

  return merge(defaultFunctions, functionsToReplace);
};

describe('sagas', () => {
  const api = createApi();
  const sagas = sagaCreator(api);

  describe('watchForLoadDeployment', () => {
    it(`forks a new saga on ${Deployments.actions.LOAD_DEPLOYMENT}`, () => {
      const id = 'i';
      const generator = sagas.watchForLoadDeployment();

      expect(generator.next().value).to.deep.equal(
        take(Deployments.actions.LOAD_DEPLOYMENT)
      );

      expect(generator.next({ id }).value).to.deep.equal(
        fork(sagas.loadDeployment, id)
      );
    });
  });

  describe('watchForLoadBranch', () => {
    it(`forks a new saga on ${Branches.actions.LOAD_BRANCH}`, () => {
      const id = 'i';
      const generator = sagas.watchForLoadBranch();

      expect(generator.next().value).to.deep.equal(
        take(Branches.actions.LOAD_BRANCH)
      );

      expect(generator.next({ id }).value).to.deep.equal(
        fork(sagas.loadBranch, id)
      );
    });
  });

  describe('watchForLoadProject', () => {
    it(`forks a new saga on ${Projects.actions.LOAD_PROJECT}`, () => {
      const id = 'i';
      const generator = sagas.watchForLoadProject();

      expect(generator.next().value).to.deep.equal(
        take(Projects.actions.LOAD_PROJECT)
      );

      expect(generator.next({ id }).value).to.deep.equal(
        fork(sagas.loadProject, id)
      );
    });
  });

  describe('watchForLoadProjects', () => {
    it(`forks a new saga on ${Projects.actions.LOAD_ALL_PROJECTS}`, () => {
      const generator = sagas.watchForLoadProjects();

      expect(generator.next().value).to.deep.equal(
        take(Projects.actions.LOAD_ALL_PROJECTS)
      );

      expect(generator.next().value).to.deep.equal(
        fork(sagas.fetchProjects)
      );
    });
  });

  describe('watchForLoadCommit', () => {
    it(`forks a new saga on ${Projects.actions.LOAD_ALL_PROJECTS}`, () => {
      const id = 'id';
      const generator = sagas.watchForLoadCommit();

      expect(generator.next().value).to.deep.equal(
        take(Commits.actions.LOAD_COMMIT)
      );

      expect(generator.next({ id }).value).to.deep.equal(
        fork(sagas.loadCommit, id)
      );
    });
  });

  describe('loadBranch', () => {
    it('fetches the branch and ensures data if it does not exist', () => {
      const id = 'b';
      const generator = sagas.loadBranch(id);

      expect(generator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, id)
      );

      expect(generator.next().value).to.deep.equal(
        call(sagas.fetchBranch, id)
      );

      expect(generator.next(true).value).to.deep.equal(
        fork(sagas.ensureBranchRelatedDataLoaded, id)
      );

      expect(generator.next().done).to.equal(true);
    });

    it('does not ensure data if fetching fails', () => {
      const id = 'b';
      const generator = sagas.loadBranch(id);

      expect(generator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, id)
      );

      expect(generator.next().value).to.deep.equal(
        call(sagas.fetchBranch, id)
      );

      expect(generator.next(false).done).to.equal(true);
    });

    it('it only ensures data if branch already exists', () => {
      const id = 'b';
      const generator = sagas.loadBranch(id);

      expect(generator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, id)
      );

      expect(generator.next({ id }).value).to.deep.equal(
        fork(sagas.ensureBranchRelatedDataLoaded, id)
      );

      expect(generator.next().done).to.equal(true);
    });
  });

  describe('loadDeployment', () => {
    it('fetches the Deployment and ensures data if it does not exist', () => {
      const id = 'b';
      const generator = sagas.loadDeployment(id);

      expect(generator.next().value).to.deep.equal(
        select(Deployments.selectors.getDeployment, id)
      );

      expect(generator.next().value).to.deep.equal(
        call(sagas.fetchDeployment, id)
      );

      expect(generator.next(true).value).to.deep.equal(
        fork(sagas.ensureDeploymentRelatedDataLoaded, id)
      );

      expect(generator.next().done).to.equal(true);
    });

    it('does not ensure data if fetching fails', () => {
      const id = 'b';
      const generator = sagas.loadDeployment(id);

      expect(generator.next().value).to.deep.equal(
        select(Deployments.selectors.getDeployment, id)
      );

      expect(generator.next().value).to.deep.equal(
        call(sagas.fetchDeployment, id)
      );

      expect(generator.next(false).done).to.equal(true);
    });

    it('it only ensures data if Deployment already exists', () => {
      const id = 'b';
      const generator = sagas.loadDeployment(id);

      expect(generator.next().value).to.deep.equal(
        select(Deployments.selectors.getDeployment, id)
      );

      expect(generator.next({ id }).value).to.deep.equal(
        fork(sagas.ensureDeploymentRelatedDataLoaded, id)
      );

      expect(generator.next().done).to.equal(true);
    });
  });

  describe('loadBranch', () => {
    it('fetches the Branch and ensures data if it does not exist', () => {
      const id = 'b';
      const generator = sagas.loadBranch(id);

      expect(generator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, id)
      );

      expect(generator.next().value).to.deep.equal(
        call(sagas.fetchBranch, id)
      );

      expect(generator.next(true).value).to.deep.equal(
        fork(sagas.ensureBranchRelatedDataLoaded, id)
      );

      expect(generator.next().done).to.equal(true);
    });

    it('does not ensure data if fetching fails', () => {
      const id = 'b';
      const generator = sagas.loadBranch(id);

      expect(generator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, id)
      );

      expect(generator.next().value).to.deep.equal(
        call(sagas.fetchBranch, id)
      );

      expect(generator.next(false).done).to.equal(true);
    });

    it('it only ensures data if Branch already exists', () => {
      const id = 'b';
      const generator = sagas.loadBranch(id);

      expect(generator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, id)
      );

      expect(generator.next({ id }).value).to.deep.equal(
        fork(sagas.ensureBranchRelatedDataLoaded, id)
      );

      expect(generator.next().done).to.equal(true);
    });
  });

  describe('loadProject', () => {
    it('fetches the Project and ensures data if it does not exist', () => {
      const id = 'b';
      const generator = sagas.loadProject(id);

      expect(generator.next().value).to.deep.equal(
        select(Projects.selectors.getProject, id)
      );

      expect(generator.next().value).to.deep.equal(
        call(sagas.fetchProject, id)
      );

      expect(generator.next(true).value).to.deep.equal(
        fork(sagas.ensureProjectRelatedDataLoaded, id)
      );

      expect(generator.next().done).to.equal(true);
    });

    it('does not ensure data if fetching fails', () => {
      const id = 'b';
      const generator = sagas.loadProject(id);

      expect(generator.next().value).to.deep.equal(
        select(Projects.selectors.getProject, id)
      );

      expect(generator.next().value).to.deep.equal(
        call(sagas.fetchProject, id)
      );

      expect(generator.next(false).done).to.equal(true);
    });

    it('it only ensures data if Project already exists', () => {
      const id = 'b';
      const generator = sagas.loadProject(id);

      expect(generator.next().value).to.deep.equal(
        select(Projects.selectors.getProject, id)
      );

      expect(generator.next({ id }).value).to.deep.equal(
        fork(sagas.ensureProjectRelatedDataLoaded, id)
      );

      expect(generator.next().done).to.equal(true);
    });
  });

  describe('fetchDeployment', () => {
    it('fetches and stores deployment', () => {
      const id = 'b';
      const response = testData.deploymentResponseNoInclude;
      const generator = sagas.fetchDeployment(id);

      expect(generator.next().value).to.deep.equal(
        put(Deployments.actions.FetchDeployment.request(id))
      );

      expect(generator.next().value).to.deep.equal(
        call(api.fetchDeployment, id)
      );

      expect(generator.next({ response: response }).value).to.deep.equal(
        put(Deployments.actions.FetchDeployment.success(id, response.data))
      );

      expect(generator.next().done).to.equal(true);
    });

    it('fetches and stores included data', () => {
      const id = 'b';
      const response = testData.deploymentResponse;
      const generator = sagas.fetchDeployment(id);

      expect(generator.next().value).to.deep.equal(
        put(Deployments.actions.FetchDeployment.request(id))
      );

      expect(generator.next().value).to.deep.equal(
        call(api.fetchDeployment, id)
      );

      expect(generator.next({ response: response }).value).to.deep.equal(
        call(sagas.storeIncludedEntities, response.included)
      );

      expect(generator.next().value).to.deep.equal(
        put(Deployments.actions.FetchDeployment.success(id, response.data))
      );

      expect(generator.next().done).to.equal(true);
    });

    it('throws an error on failure', () => {
      const id = 'b';
      const errorMessage = 'an error message';

      const generator = sagas.fetchDeployment(id);

      expect(generator.next().value).to.deep.equal(
        put(Deployments.actions.FetchDeployment.request(id))
      );

      expect(generator.next().value).to.deep.equal(
        call(api.fetchDeployment, id)
      );

      expect(generator.next({ error: errorMessage }).value).to.deep.equal(
        put(Deployments.actions.FetchDeployment.failure(id, errorMessage))
      );

      expect(generator.next().done).to.equal(true);
    });
  });

  describe('fetchBranch', () => {
    it('fetches and stores branch', () => {
      const id = 'b';
      const response = testData.branchResponseNoInclude;
      const generator = sagas.fetchBranch(id);

      expect(generator.next().value).to.deep.equal(
        put(Branches.actions.FetchBranch.request(id))
      );

      expect(generator.next().value).to.deep.equal(
        call(api.fetchBranch, id)
      );

      expect(generator.next({ response: response }).value).to.deep.equal(
        put(Branches.actions.FetchBranch.success(id, response.data))
      );

      expect(generator.next().done).to.equal(true);
    });

    it('fetches and stores included data', () => {
      const id = 'b';
      const response = testData.branchResponse;
      const generator = sagas.fetchBranch(id);

      expect(generator.next().value).to.deep.equal(
        put(Branches.actions.FetchBranch.request(id))
      );

      expect(generator.next().value).to.deep.equal(
        call(api.fetchBranch, id)
      );

      expect(generator.next({ response: response }).value).to.deep.equal(
        call(sagas.storeIncludedEntities, response.included)
      );

      expect(generator.next().value).to.deep.equal(
        put(Branches.actions.FetchBranch.success(id, response.data))
      );

      expect(generator.next().done).to.equal(true);
    });

    it('throws an error on failure', () => {
      const id = 'b';
      const errorMessage = 'an error message';

      const generator = sagas.fetchBranch(id);

      expect(generator.next().value).to.deep.equal(
        put(Branches.actions.FetchBranch.request(id))
      );

      expect(generator.next().value).to.deep.equal(
        call(api.fetchBranch, id)
      );

      expect(generator.next({ error: errorMessage }).value).to.deep.equal(
        put(Branches.actions.FetchBranch.failure(id, errorMessage))
      );

      expect(generator.next().done).to.equal(true);
    });
  });

  describe('fetchProject', () => {
    it('fetches and stores project', () => {
      const id = 'b';
      const response = testData.projectResponseNoInclude;
      const generator = sagas.fetchProject(id);

      expect(generator.next().value).to.deep.equal(
        put(Projects.actions.FetchProject.request(id))
      );

      expect(generator.next().value).to.deep.equal(
        call(api.fetchProject, id)
      );

      expect(generator.next({ response: response }).value).to.deep.equal(
        put(Projects.actions.FetchProject.success(id, response.data))
      );

      expect(generator.next().done).to.equal(true);
    });

    it('fetches and stores included data', () => {
      const id = 'b';
      const response = testData.projectResponse;
      const generator = sagas.fetchProject(id);

      expect(generator.next().value).to.deep.equal(
        put(Projects.actions.FetchProject.request(id))
      );

      expect(generator.next().value).to.deep.equal(
        call(api.fetchProject, id)
      );

      expect(generator.next({ response: response }).value).to.deep.equal(
        call(sagas.storeIncludedEntities, response.included)
      );

      expect(generator.next().value).to.deep.equal(
        put(Projects.actions.FetchProject.success(id, response.data))
      );

      expect(generator.next().done).to.equal(true);
    });

    it('throws an error on failure', () => {
      const id = 'b';
      const errorMessage = 'an error message';

      const generator = sagas.fetchProject(id);

      expect(generator.next().value).to.deep.equal(
        put(Projects.actions.FetchProject.request(id))
      );

      expect(generator.next().value).to.deep.equal(
        call(api.fetchProject, id)
      );

      expect(generator.next({ error: errorMessage }).value).to.deep.equal(
        put(Projects.actions.FetchProject.failure(id, errorMessage))
      );

      expect(generator.next().done).to.equal(true);
    });
  });

  describe('fetchProjects', () => {
    it('fetches and stores all projects', () => {
      const response = testData.projectsResponseNoInclude;
      const generator = sagas.fetchProjects();

      expect(generator.next().value).to.deep.equal(
        put(Projects.actions.FetchProjects.request())
      );

      expect(generator.next().value).to.deep.equal(
        call(api.fetchProjects)
      );

      expect(generator.next({ response: response }).value).to.deep.equal(
        put(Projects.actions.FetchProjects.success(response.data))
      );

      expect(generator.next().value).to.deep.equal(
        fork(sagas.ensureAllProjectsRelatedDataLoaded)
      );

      expect(generator.next().done).to.equal(true);
    });

    it('fetches and stores included data', () => {
      const response = testData.projectsResponse;
      const generator = sagas.fetchProjects();

      expect(generator.next().value).to.deep.equal(
        put(Projects.actions.FetchProjects.request())
      );

      expect(generator.next().value).to.deep.equal(
        call(api.fetchProjects)
      );

      expect(generator.next({ response: response }).value).to.deep.equal(
        call(sagas.storeIncludedEntities, response.included)
      );

      expect(generator.next().value).to.deep.equal(
        put(Projects.actions.FetchProjects.success(response.data))
      );

      expect(generator.next().value).to.deep.equal(
        fork(sagas.ensureAllProjectsRelatedDataLoaded)
      );

      expect(generator.next().done).to.equal(true);
    });

    it('throws an error on failure', () => {
      const errorMessage = 'an error message';
      const generator = sagas.fetchProjects();

      expect(generator.next().value).to.deep.equal(
        put(Projects.actions.FetchProjects.request())
      );

      expect(generator.next().value).to.deep.equal(
        call(api.fetchProjects)
      );

      expect(generator.next({ error: errorMessage }).value).to.deep.equal(
        put(Projects.actions.FetchProjects.failure(errorMessage))
      );

      expect(generator.next().done).to.equal(true);
    });
  });

  describe('ensureAllProjectsRelatedDataLoaded', () => {
    it('makes sure branches and first deployments exist for all projects', () => {
      const generator = sagas.ensureAllProjectsRelatedDataLoaded();
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

      expect(generator.next().value).to.deep.equal(
        select(Projects.selectors.getProjects)
      );

      expect(generator.next(projects).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'branches', '1'),
          call(sagas.fetchIfMissing, 'branches', '2'),
        ]
      );

      expect(generator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, '1')
      );

      expect(generator.next(branches['1']).value).to.deep.equal(
        select(Branches.selectors.getBranch, '2')
      );

      expect(generator.next(branches['2']).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'branches', '3'),
        ]
      );

      expect(generator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, '3')
      );

      expect(generator.next(branches['3']).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'deployments', 'd1'),
          call(sagas.fetchIfMissing, 'deployments', 'd2'),
        ]
      );

      expect(generator.next().done).to.equal(true);
    });
  });

  describe('ensureProjectRelatedDataLoaded', () => {
    it('makes sure branches and all deployments exist for the project', () => {
      const id = '1';
      const generator = sagas.ensureProjectRelatedDataLoaded(id);
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

      expect(generator.next().value).to.deep.equal(
        select(Projects.selectors.getProject, id)
      );

      expect(generator.next(project).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'branches', '1'),
          call(sagas.fetchIfMissing, 'branches', '2'),
          call(sagas.fetchIfMissing, 'branches', '3'),
        ]
      );

      expect(generator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, '1')
      );

      expect(generator.next(branches['1']).value).to.deep.equal(
        select(Branches.selectors.getBranch, '2')
      );

      expect(generator.next(branches['2']).value).to.deep.equal(
        select(Branches.selectors.getBranch, '3')
      );

      expect(generator.next(branches['3']).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'deployments', 'd1'),
          call(sagas.fetchIfMissing, 'deployments', 'd2'),
          call(sagas.fetchIfMissing, 'deployments', 'd3'),
          call(sagas.fetchIfMissing, 'deployments', 'd4'),
        ]
      );

      expect(generator.next().done).to.equal(true);
    });
  });

  describe('ensureBranchRelatedDataLoaded', () => {
    it('makes sure commits and deployments exist for the branch', () => {
      const id = '1';
      const generator = sagas.ensureBranchRelatedDataLoaded(id);
      const branch: Branch = {
        id: 'a',
        name: 'brancha',
        project: '1',
        commits: ['c1', 'c2', 'c3'],
        deployments: ['d1'],
      };

      expect(generator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, id)
      );

      expect(generator.next(branch).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'deployments', 'd1'),
        ]
      );

      expect(generator.next().value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'commits', 'c1'),
          call(sagas.fetchIfMissing, 'commits', 'c2'),
          call(sagas.fetchIfMissing, 'commits', 'c3'),
        ]
      );

      expect(generator.next().done).to.equal(true);
    });
  });

  describe('ensureDeploymentRelatedDataLoaded', () => {
    it('makes sure commit exists for the deployment', () => {
      const id = '1';
      const generator = sagas.ensureDeploymentRelatedDataLoaded(id);
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

      expect(generator.next().value).to.deep.equal(
        select(Deployments.selectors.getDeployment, id)
      );

      expect(generator.next(deployment).value).to.deep.equal(
        call(sagas.fetchIfMissing, 'commits', 'c1')
      );

      expect(generator.next().done).to.equal(true);
    });
  });

  describe('ensureCommitRelatedDataLoaded', () => {
    it('makes sure commit exists for the Commit', () => {
      const id = '1';
      const generator = sagas.ensureCommitRelatedDataLoaded(id);
      const commit: Commit = {
        hash: 'a',
        deployment: 'd1',
        branch: 'b1',
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

      expect(generator.next().value).to.deep.equal(
        select(Commits.selectors.getCommit, id)
      );

      expect(generator.next(commit).value).to.deep.equal(
        call(sagas.fetchIfMissing, 'deployments', 'd1')
      );

      expect(generator.next().done).to.equal(true);
    });
  });

  describe('fetchIfMissing', () => {
    it('fetches missing commits', () => {
      const id = '1';
      const generator = sagas.fetchIfMissing('commits', id);

      expect(generator.next().value).to.deep.equal(
        select(Commits.selectors.getCommit, id)
      );

      expect(generator.next().value).to.deep.equal(
        call(sagas.fetchCommit, id)
      );

      expect(generator.next().done).to.equal(true);
    });

    it('fetches missing deployments', () => {
      const id = '1';
      const generator = sagas.fetchIfMissing('deployments', id);

      expect(generator.next().value).to.deep.equal(
        select(Deployments.selectors.getDeployment, id)
      );

      expect(generator.next().value).to.deep.equal(
        call(sagas.fetchDeployment, id)
      );

      expect(generator.next().done).to.equal(true);
    });

    it('fetches missing projects', () => {
      const id = '1';
      const generator = sagas.fetchIfMissing('projects', id);

      expect(generator.next().value).to.deep.equal(
        select(Projects.selectors.getProject, id)
      );

      expect(generator.next().value).to.deep.equal(
        call(sagas.fetchProject, id)
      );

      expect(generator.next().done).to.equal(true);
    });

    it('fetches missing branches', () => {
      const id = '1';
      const generator = sagas.fetchIfMissing('branches', id);

      expect(generator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, id)
      );

      expect(generator.next().value).to.deep.equal(
        call(sagas.fetchBranch, id)
      );

      expect(generator.next().done).to.equal(true);
    });

    it('fetches does not fetch already existing data', () => {
      const id = '1';
      const generator = sagas.fetchIfMissing('commits', id);

      expect(generator.next().value).to.deep.equal(
        select(Commits.selectors.getCommit, id)
      );

      expect(generator.next({ id }).done).to.equal(true);
    });
  });

  describe('storeIncludedEntities', () => {
    it('stores passed entities', () => {
      const response = testData.branchResponse;
      const generator = sagas.storeIncludedEntities(response.included);
      const deploymentsEntities = response.included.filter(entity => entity.type === 'deployments');
      const commitsEntities = response.included.filter(entity => entity.type === 'commits');

      expect(generator.next().value).to.deep.equal(
        put(Deployments.actions.StoreDeployments(deploymentsEntities))
      );

      expect(generator.next().value).to.deep.equal(
        put(Commits.actions.StoreCommits(commitsEntities))
      );

      expect(generator.next().done).to.equal(true);
    });

    it('handles an empty included section', () => {
      const generatorUndefined = sagas.storeIncludedEntities(undefined);
      expect(generatorUndefined.next().done).to.equal(true);

      const generatorEmpty = sagas.storeIncludedEntities([]);
      expect(generatorEmpty.next().done).to.equal(true);
    });
  });
});
