import { expect } from 'chai';
import { SubmissionError } from 'redux-form';
import { Effect, call, fork, put, race, select, take } from 'redux-saga/effects';

import { Api, ApiEntityTypeString, ApiPromise, ApiResponse } from '../src/js/api/types';
import Activities, { ActivityType } from '../src/js/modules/activities';
import Branches, { Branch } from '../src/js/modules/branches';
import Commits, { Commit } from '../src/js/modules/commits';
import Deployments, { Deployment } from '../src/js/modules/deployments';
import { FetchError } from '../src/js/modules/errors';
import { FORM_SUBMIT } from '../src/js/modules/forms';
import Projects, { Project } from '../src/js/modules/projects';
import { StateTree } from '../src/js/reducers';
import sagaCreator from '../src/js/sagas';

const testData = {
  allProjectsResponse: require('../json/projects.json') as ApiResponse,
  deploymentResponse: require('../json/deployment-7.json') as ApiResponse,
  branchResponse: require('../json/branch-1.json') as ApiResponse,
  commitResponse: require('../json/commit.json') as ApiResponse,
  projectResponse: require('../json/project-1.json') as ApiResponse,
  activitiesResponse: require('../json/activities.json') as ApiResponse,
};

const createApi = (): Api => {
  return {
    Project: {
      fetchAll: () => Promise.resolve({ response: {} }),
      fetch: (id: string) => Promise.resolve({ response: {} }),
      create: (name: string, description?: string) => Promise.resolve({ response: {} }),
      edit: (id: string, newAttributes: { description?: string, name?: string }) =>
        Promise.resolve({ response: {} }),
      delete: (id: string) => Promise.resolve({ response: {} }),
    },
    Activity: {
      fetchAll: () => Promise.resolve({ response: {} }),
      fetchAllForProject: (id: string) => Promise.resolve({ response: {} }),
    },
    Deployment: {
      fetch: (id: string) => Promise.resolve({ response: {} }),
    },
    Branch: {
      fetch: (id: string) => Promise.resolve({ response: {} }),
    },
    Commit: {
      fetch: (id: string) => Promise.resolve({ response: {} }),
    },
  };
};

describe('sagas', () => {
  const api = createApi();
  const sagas = sagaCreator(api);

  const testWatcher = (
    name: string,
    actionType: string,
    iterator: IterableIterator<Effect | Effect[]>,
    loader: (action: any) => IterableIterator<Effect>
  ) => {
    describe(name, () => {
      const action = { type: actionType, id: 'id' };

      it(`forks a new saga on ${actionType}`, () => {
        expect(iterator.next().value).to.deep.equal(
          take(actionType)
        );

        expect(iterator.next(action).value).to.deep.equal(
          fork(loader, action)
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

  testWatcher(
    'watchForLoadActivitiesForProject',
    Activities.actions.LOAD_ACTIVITIES_FOR_PROJECT,
    sagas.watchForLoadActivitiesForProject(),
    sagas.loadActivitiesForProject
  );

  testWatcher(
    'watchForCreateProject',
    Projects.actions.CREATE_PROJECT,
    sagas.watchForCreateProject(),
    sagas.createProject
  );

  testWatcher(
    'watchForEditProject',
    Projects.actions.EDIT_PROJECT,
    sagas.watchForEditProject(),
    sagas.editProject
  );

  testWatcher(
    'watchForDeleteProject',
    Projects.actions.DELETE_PROJECT,
    sagas.watchForDeleteProject(),
    sagas.deleteProject
  );

  describe('watchForLoadAllProjects', () => {
    it(`calls a new saga on ${Projects.actions.LOAD_ALL_PROJECTS}`, () => {
      const iterator = sagas.watchForLoadAllProjects();
      const action = { type: Projects.actions.LOAD_ALL_PROJECTS };

      expect(iterator.next().value).to.deep.equal(
        take(Projects.actions.LOAD_ALL_PROJECTS)
      );

      expect(iterator.next(action).value).to.deep.equal(
        call(sagas.loadAllProjects)
      );
    });
  });

  describe('watchForLoadActivities', () => {
    it(`calls a new saga on ${Activities.actions.LOAD_ACTIVITIES}`, () => {
      const iterator = sagas.watchForLoadActivities();
      const action = { type: Activities.actions.LOAD_ACTIVITIES };

      expect(iterator.next().value).to.deep.equal(
        take(Activities.actions.LOAD_ACTIVITIES)
      );

      expect(iterator.next(action).value).to.deep.equal(
        call(sagas.loadActivities)
      );
    });
  });

  describe('watchForFormSubmit', () => {
    it(`forks a new saga on ${FORM_SUBMIT}`, () => {
      const iterator = sagas.watchForFormSubmit();
      const action = { type: FORM_SUBMIT, values: 'foo' };

      expect(iterator.next().value).to.deep.equal(
        take(FORM_SUBMIT)
      );

      expect(iterator.next(action).value).to.deep.equal(
        fork(sagas.formSubmitSaga, action)
      );
    });
  });

  const testLoader = (
    name: string,
    loader: (action: any) => IterableIterator<Effect>,
    selector: (state: StateTree, id: string) => Branch | Commit | Deployment | Project | FetchError,
    fetcher: (id: string) => IterableIterator<Effect>,
    ensurer: (id: string) => IterableIterator<Effect | Effect[]>,
  ) => {
    describe(name, () => {
      const id = 'id';
      const action = {
        type: 'foo',
        id,
      };

      it('fetches the entity and ensures data if it does not exist', () => {
        const iterator = loader(action);

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
        const iterator = loader(action);

        expect(iterator.next().value).to.deep.equal(
          select(selector, id)
        );

        expect(iterator.next().value).to.deep.equal(
          call(fetcher, id)
        );

        expect(iterator.next(false).done).to.equal(true);
      });

      it('it still ensures data even if entity already exists', () => {
        const iterator = loader(action);

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

  describe('loadAllProjects', () => {
    it('fetches projects and ensures data', () => {
      const iterator = sagas.loadAllProjects();

      expect(iterator.next().value).to.deep.equal(
        call(sagas.fetchAllProjects)
      );

      expect(iterator.next(true).value).to.deep.equal(
        fork(sagas.ensureAllProjectsRelatedDataLoaded)
      );

      expect(iterator.next().done).to.equal(true);
    });

    it('does not ensure data if fetching fails', () => {
      const iterator = sagas.loadAllProjects();

      expect(iterator.next().value).to.deep.equal(
        call(sagas.fetchAllProjects)
      );

      expect(iterator.next(false).done).to.equal(true);
    });
  });

  describe('loadActivities', () => {
    it('fetches activities and ensures data', () => {
      const iterator = sagas.loadActivities();

      expect(iterator.next().value).to.deep.equal(
        call(sagas.fetchActivities)
      );

      expect(iterator.next(true).value).to.deep.equal(
        fork(sagas.ensureActivitiesRelatedDataLoaded)
      );

      expect(iterator.next().done).to.equal(true);
    });

    it('does not ensure data if fetching fails', () => {
      const iterator = sagas.loadActivities();

      expect(iterator.next().value).to.deep.equal(
        call(sagas.fetchActivities)
      );

      expect(iterator.next(false).done).to.equal(true);
    });
  });

  describe('loadActivitiesForProject', () => {
    const id = 'id';
    const action = {
      type: Activities.actions.LOAD_ACTIVITIES_FOR_PROJECT,
      id,
    };

    it('fetches projects and ensures data', () => {
      const iterator = sagas.loadActivitiesForProject(action);

      expect(iterator.next().value).to.deep.equal(
        call(sagas.fetchActivitiesForProject, id)
      );

      expect(iterator.next(true).value).to.deep.equal(
        fork(sagas.ensureActivitiesRelatedDataLoaded)
      );

      expect(iterator.next().done).to.equal(true);
    });

    it('does not ensure data if fetching fails', () => {
      const iterator = sagas.loadActivitiesForProject(action);

      expect(iterator.next().value).to.deep.equal(
        call(sagas.fetchActivitiesForProject, id)
      );

      expect(iterator.next(false).done).to.equal(true);
    });
  });

  interface RequestActionCreators {
    request: (id: string) => any;
    success: (id: string, data: any) => any;
    failure: (id: string, error: string, details?: string) => any;
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

        expect(iterator.next({ response }).value).to.deep.equal(
          call(sagas.storeIncludedEntities, response.included)
        );

        expect(iterator.next().value).to.deep.equal(
          put(requestActionCreators.success(id, response.data))
        );

        expect(iterator.next().done).to.equal(true);
      });

      it('throws an error on failure', () => {
        const errorMessage = 'an error message';
        const details = 'a detailed error message';
        const iterator = fetcher(id);

        expect(iterator.next().value).to.deep.equal(
          put(requestActionCreators.request(id))
        );

        expect(iterator.next().value).to.deep.equal(
          call(apiCall, id)
        );

        expect(iterator.next({ error: errorMessage, details }).value).to.deep.equal(
          put(requestActionCreators.failure(id, errorMessage, details))
        );

        expect(iterator.next().done).to.equal(true);
      });
    });
  };

  testFetcher(
    'fetchDeployment',
    testData.deploymentResponse,
    { data: testData.deploymentResponse.data },
    Deployments.actions.FetchDeployment,
    sagas.fetchDeployment,
    api.Deployment.fetch,
  );

  testFetcher(
    'fetchBranch',
    testData.branchResponse,
    { data: testData.branchResponse.data },
    Branches.actions.FetchBranch,
    sagas.fetchBranch,
    api.Branch.fetch,
  );

  testFetcher(
    'fetchCommit',
    testData.commitResponse,
    { data: testData.commitResponse.data },
    Commits.actions.FetchCommit,
    sagas.fetchCommit,
    api.Commit.fetch,
  );

  testFetcher(
    'fetchProject',
    testData.projectResponse,
    { data: testData.projectResponse.data },
    Projects.actions.FetchProject,
    sagas.fetchProject,
    api.Project.fetch,
  );

  describe('fetchActivities', () => {
    it('fetches and stores all activities', () => {
      const response = { data: testData.activitiesResponse.data };
      const iterator = sagas.fetchActivities();

      expect(iterator.next().value).to.deep.equal(
        put(Activities.actions.FetchActivities.request())
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Activity.fetchAll)
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        put(Activities.actions.FetchActivities.success(<any> response.data))
      );

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('fetches and stores included data', () => {
      const response = testData.activitiesResponse;
      const iterator = sagas.fetchActivities();

      expect(iterator.next().value).to.deep.equal(
        put(Activities.actions.FetchActivities.request())
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Activity.fetchAll)
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        call(sagas.storeIncludedEntities, response.included)
      );

      expect(iterator.next().value).to.deep.equal(
        put(Activities.actions.FetchActivities.success(<any> response.data))
      );

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('throws an error on failure', () => {
      const errorMessage = 'an error message';
      const iterator = sagas.fetchActivities();

      expect(iterator.next().value).to.deep.equal(
        put(Activities.actions.FetchActivities.request())
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Activity.fetchAll)
      );

      expect(iterator.next({ error: errorMessage }).value).to.deep.equal(
        put(Activities.actions.FetchActivities.failure(errorMessage))
      );

      const result = iterator.next();

      expect(result.value).to.equal(false);
      expect(result.done).to.equal(true);
    });
  });

  describe('fetchActivitiesForProject', () => {
    const id = 'id';

    it('fetches and stores activities', () => {
      const response = { data: testData.activitiesResponse.data };
      const iterator = sagas.fetchActivitiesForProject(id);

      expect(iterator.next().value).to.deep.equal(
        put(Activities.actions.FetchActivitiesForProject.request(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Activity.fetchAllForProject, id)
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        put(Activities.actions.FetchActivitiesForProject.success(id, <any> response.data))
      );

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('fetches and stores included data', () => {
      const response = testData.activitiesResponse;
      const iterator = sagas.fetchActivitiesForProject(id);

      expect(iterator.next().value).to.deep.equal(
        put(Activities.actions.FetchActivitiesForProject.request(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Activity.fetchAllForProject, id)
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        call(sagas.storeIncludedEntities, response.included)
      );

      expect(iterator.next().value).to.deep.equal(
        put(Activities.actions.FetchActivitiesForProject.success(id, <any> response.data))
      );

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('throws an error on failure', () => {
      const errorMessage = 'an error message';
      const iterator = sagas.fetchActivitiesForProject(id);

      expect(iterator.next().value).to.deep.equal(
        put(Activities.actions.FetchActivitiesForProject.request(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Activity.fetchAllForProject, id)
      );

      expect(iterator.next({ error: errorMessage }).value).to.deep.equal(
        put(Activities.actions.FetchActivitiesForProject.failure(id, errorMessage))
      );

      const result = iterator.next();

      expect(result.value).to.equal(false);
      expect(result.done).to.equal(true);
    });
  });

  describe('fetchAllProjects', () => {
    it('fetches and stores all projects', () => {
      const response = { data: testData.allProjectsResponse };
      const iterator = sagas.fetchAllProjects();

      expect(iterator.next().value).to.deep.equal(
        put(Projects.actions.FetchAllProjects.request())
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Project.fetchAll)
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        put(Projects.actions.FetchAllProjects.success(<any> response.data))
      );

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('fetches and stores included data', () => {
      const response = testData.allProjectsResponse;
      const iterator = sagas.fetchAllProjects();

      expect(iterator.next().value).to.deep.equal(
        put(Projects.actions.FetchAllProjects.request())
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Project.fetchAll)
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        call(sagas.storeIncludedEntities, response.included)
      );

      expect(iterator.next().value).to.deep.equal(
        put(Projects.actions.FetchAllProjects.success(<any> response.data))
      );

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('throws an error on failure', () => {
      const errorMessage = 'an error message';
      const iterator = sagas.fetchAllProjects();

      expect(iterator.next().value).to.deep.equal(
        put(Projects.actions.FetchAllProjects.request())
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Project.fetchAll)
      );

      expect(iterator.next({ error: errorMessage }).value).to.deep.equal(
        put(Projects.actions.FetchAllProjects.failure(errorMessage))
      );

      const result = iterator.next();

      expect(result.value).to.equal(false);
      expect(result.done).to.equal(true);
    });
  });

  describe('ensureActivitiesRelatedDataLoaded', () => {
    it('makes sure branches and first deployments exist for all projects', () => {
      const iterator = sagas.ensureActivitiesRelatedDataLoaded();
      const activities = [
        {
          id: '1',
          type: ActivityType.Deployment,
          deployment: '7',
          branch: '1',
          project: '1',
          timestamp: 1470131481802,
        },
        {
          id: '2',
          type: ActivityType.Deployment,
          deployment: '8',
          branch: '2',
          project: '1',
          timestamp: 1470045081802,
        },
      ];

      const deployments = [
        {
          id: '7',
          url: '#',
          screenshot: '#',
          creator: {
            name: 'Ville Saarinen',
            email: 'ville.saarinen@lucify.com',
            timestamp: 1470131481802,
          },
          commit: 'aacceeff02',
        },
        {
          id: '8',
          url: '#',
          screenshot: '#',
          creator: {
            name: undefined,
            email: 'juho@lucify.com',
            timestamp: 1470131481902,
          },
          commit: 'aacceeff03',
        },
      ];

      expect(iterator.next().value).to.deep.equal(
        select(Activities.selectors.getActivities)
      );

      expect(iterator.next(activities).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'deployments', '7'),
          call(sagas.fetchIfMissing, 'deployments', '8'),
        ]
      );

      expect(iterator.next(deployments).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'commits', 'aacceeff02'),
          call(sagas.fetchIfMissing, 'commits', 'aacceeff03'),
        ]
      );

      expect(iterator.next([]).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'projects', '1'),
        ]
      );

      expect(iterator.next([]).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'branches', '1'),
          call(sagas.fetchIfMissing, 'branches', '2'),
        ]
      );

      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('ensureAllProjectsRelatedDataLoaded', () => {
    it('makes sure deployments, commits, branches and projects exist for all activities', () => {
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

      expect(iterator.next().value).to.deep.equal(
        select(Projects.selectors.getProjects)
      );

      expect(iterator.next(projects).value).to.deep.equal(
        call(sagas.ensureProjectRelatedDataLoaded, projects[0])
      );

      expect(iterator.next().value).to.deep.equal(
        call(sagas.ensureProjectRelatedDataLoaded, projects[1])
      );

      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('ensureProjectRelatedDataLoaded', () => {
    it('makes sure branches and latest deployments exist for the project', () => {
      const id = '1';
      const iterator = sagas.ensureProjectRelatedDataLoaded(id);
      const project: Project = {
        id: '1',
        name: 'name',
        branches: ['1', '2', '3'],
        activeUsers: [],
      };
      const branches: Branch[] = [
        {
          id: 'a',
          name: 'brancha',
          project: '1',
          commits: [],
          deployments: ['d1'],
        },
        {
          id: 'b',
          name: 'branchb',
          project: '1',
          commits: [],
          deployments: [],
        },
        {
          id: 'c',
          name: 'branchc',
          project: '1',
          commits: [],
          deployments: ['d2', 'd3', 'd4'],
        },
      ];

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

      expect(iterator.next(branches).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'deployments', 'd1'),
          call(sagas.fetchIfMissing, 'deployments', 'd2'),
        ]
      );

      expect(iterator.next().done).to.equal(true);
    });

    it('also accepts a Project as a parameter', () => {
      const project: Project = {
        id: '1',
        name: 'name',
        branches: ['1', '2', '3'],
        activeUsers: [],
      };

      const iterator = sagas.ensureProjectRelatedDataLoaded(project);

      const branches: Branch[] = [
        {
          id: 'a',
          name: 'brancha',
          project: '1',
          commits: [],
          deployments: ['d1'],
        },
        {
          id: 'b',
          name: 'branchb',
          project: '1',
          commits: [],
          deployments: [],
        },
        {
          id: 'c',
          name: 'branchc',
          project: '1',
          commits: [],
          deployments: ['d2', 'd3', 'd4'],
        },
      ];

      expect(iterator.next().value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'branches', '1'),
          call(sagas.fetchIfMissing, 'branches', '2'),
          call(sagas.fetchIfMissing, 'branches', '3'),
        ]
      );

      expect(iterator.next(branches).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'deployments', 'd1'),
          call(sagas.fetchIfMissing, 'deployments', 'd2'),
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
        call(sagas.fetchIfMissing, 'projects', '1')
      );

      expect(iterator.next().value).to.deep.equal(
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
        status: 'success',
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
        committer: {
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
      selector: (state: StateTree, id: string) => Branch | Commit | Deployment | Project | FetchError,
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

        expect(iterator.next().value).to.deep.equal(
          select(selector, id)
        );

        const obj = { id };
        const next = iterator.next(obj);

        expect(next.done).to.equal(true);
        expect(next.value).to.equal(obj);
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

      const obj = { id };
      const next = iterator.next(obj);

      expect(next.done).to.equal(true);
      expect(next.value).to.equal(obj);
    });
  });

  describe('storeIncludedEntities', () => {
    it('stores passed entities', () => {
      const includedData = testData.branchResponse.included!;
      const iterator = sagas.storeIncludedEntities(includedData);
      const deploymentsEntities = includedData.filter(entity => entity.type === 'deployments');
      const commitsEntities = includedData.filter(entity => entity.type === 'commits');

      expect(iterator.next().value).to.deep.equal(
        put(Deployments.actions.storeDeployments(<any> deploymentsEntities))
      );

      expect(iterator.next().value).to.deep.equal(
        put(Commits.actions.storeCommits(<any> commitsEntities))
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

  describe('createProject', () => {
    const name = 'projectName';
    const description = 'projectDescription';
    const action = {
      type: 'SUBMITACTION',
      payload: {
        name,
        description,
      },
    };

    it('stores information that a request has been started', () => {
      const iterator = sagas.createProject(action);

      expect(iterator.next().value).to.deep.equal(
        put(Projects.actions.SendCreateProject.request(name))
      );
    });

    it('calls the API createProject function', () => {
      const iterator = sagas.createProject(action);

      iterator.next();

      expect(iterator.next().value).to.deep.equal(
        call(api.Project.create, name, description)
      );
    });

    it('saves the returned project and generates a .success action if the submission succeeds', () => {
      const iterator = sagas.createProject(action);
      const projectId = '58';
      const response = { data: { id: projectId, type: 'projects' } };

      iterator.next();
      iterator.next();

      expect(iterator.next({ response }).value).to.deep.equal(
        put(Projects.actions.FetchProject.success(projectId, <any> response.data))
      );

      expect(iterator.next().value).to.deep.equal(
        put(Projects.actions.SendCreateProject.success(projectId))
      );

      const val = iterator.next();
      expect(val.value).to.equal(true);
      expect(val.done).to.equal(true);
    });

    it('generates a .failure action if the submission fails', () => {
      const iterator = sagas.createProject(action);
      const error = 'error!';

      iterator.next();
      iterator.next();

      expect(iterator.next({ error }).value).to.deep.equal(
        put(Projects.actions.SendCreateProject.failure(error))
      );

      const val = iterator.next();
      expect(val.value).to.equal(false);
      expect(val.done).to.equal(true);
    });
  });

  describe('deleteProject', () => {
    const id = '23524';
    const resolve = () => ({});
    const reject = () => ({});
    const action = {
      type: 'DELETEACTION',
      id,
      resolve,
      reject,
    };

    it('stores information that a request has been started', () => {
      const iterator = sagas.deleteProject(action);

      expect(iterator.next().value).to.deep.equal(
        put(Projects.actions.SendDeleteProject.request(id))
      );
    });

    it('calls the API deleteProject function', () => {
      const iterator = sagas.deleteProject(action);

      iterator.next();

      expect(iterator.next().value).to.deep.equal(
        call(api.Project.delete, id)
      );
    });

    it('resolves the promise and generates a .success action if the deletion succeeds', () => {
      const iterator = sagas.deleteProject(action);
      const response = 'ok';

      iterator.next();
      iterator.next();

      expect(iterator.next({ response }).value).to.deep.equal(
        call(resolve)
      );

      expect(iterator.next().value).to.deep.equal(
        put(Projects.actions.SendDeleteProject.success(id))
      );

      const val = iterator.next();
      expect(val.value).to.equal(true);
      expect(val.done).to.equal(true);
    });

    it('generates a .failure action if the deletion fails', () => {
      const iterator = sagas.deleteProject(action);
      const error = 'error!';

      iterator.next();
      iterator.next();

      expect(iterator.next({ error }).value).to.deep.equal(
        call(reject)
      );

      expect(iterator.next().value).to.deep.equal(
        put(Projects.actions.SendDeleteProject.failure(id, error))
      );

      const val = iterator.next();
      expect(val.value).to.equal(false);
      expect(val.done).to.equal(true);
    });
  });

  describe('editProject', () => {
    const id = '23524';
    const name = 'projectName-new';
    const description = 'projectDescription-edited';
    const action = {
      type: 'SUBMITACTION',
      payload: {
        id,
        name,
        description,
      },
    };

    it('stores information that a request has been started', () => {
      const iterator = sagas.editProject(action);

      expect(iterator.next().value).to.deep.equal(
        put(Projects.actions.SendEditProject.request(id))
      );
    });

    it('calls the API editProject function', () => {
      const iterator = sagas.editProject(action);

      iterator.next();

      expect(iterator.next().value).to.deep.equal(
        call(api.Project.edit, id, { name, description })
      );
    });

    it('saves the returned project and generates a .success action if the submission succeeds', () => {
      const iterator = sagas.editProject(action);
      const response = { data: { id, attributes: { name, description }}};

      iterator.next();
      iterator.next();

      expect(iterator.next({ response }).value).to.deep.equal(
        put(Projects.actions.FetchProject.success(id, <any> response.data))
      );

      expect(iterator.next().value).to.deep.equal(
        put(Projects.actions.SendEditProject.success(id))
      );

      const val = iterator.next();
      expect(val.value).to.equal(true);
      expect(val.done).to.equal(true);
    });

    it('generates a .failure action if the submission fails', () => {
      const iterator = sagas.editProject(action);
      const error = 'error!';

      iterator.next();
      iterator.next();

      expect(iterator.next({ error }).value).to.deep.equal(
        put(Projects.actions.SendEditProject.failure(id, error))
      );

      const val = iterator.next();
      expect(val.value).to.equal(false);
      expect(val.done).to.equal(true);
    });
  });

  describe('formSubmitSaga', () => {
    const submitAction = 'SUBMITACTION';
    const successAction = 'SUCCESSACTION';
    const failureAction = 'FAILUREACTION';
    const values = { foo: 'bar' };
    const resolve = () => {}; // tslint:disable-line
    const reject = () => {}; // tslint:disable-line

    const payload = {
      submitAction,
      successAction,
      failureAction,
      values,
      resolve,
      reject,
    };

    it('starts submitting form data', () => {
      const iterator = sagas.formSubmitSaga({ payload });

      expect(iterator.next().value).to.deep.equal(
        put({ type: submitAction, payload: values })
      );
    });

    it('resolves the supplied promise if submitting is successful', () => {
      const iterator = sagas.formSubmitSaga({ payload });

      iterator.next();

      expect(iterator.next().value).to.deep.equal(
        race({
          success: take(successAction),
          failure: take(failureAction),
        })
      );

      expect(iterator.next({ success: { id: 3 } }).value).to.deep.equal(
        call(resolve, 3)
      );

      expect(iterator.next().done).to.equal(true);
    });

    it('rejects the promise with a SubmissionError if submitting the form fails', () => {
      const iterator = sagas.formSubmitSaga({ payload });

      iterator.next();

      expect(iterator.next().value).to.deep.equal(
        race({
          success: take(successAction),
          failure: take(failureAction),
        })
      );

      expect(iterator.next({ failure: { prettyError: 'foobar' } }).value).to.deep.equal(
        call(reject, new SubmissionError({ _error: 'foobar' }))
      );

      expect(iterator.next().done).to.equal(true);
    });
  });
});
