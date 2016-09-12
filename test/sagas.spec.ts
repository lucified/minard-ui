import { expect } from 'chai';
import { Action } from 'redux';
import { SubmissionError } from 'redux-form';
import { Effect, call, fork, put, race, select, take } from 'redux-saga/effects';

import * as Converter from '../src/js/api/convert';
import { Api, ApiEntityTypeString, ApiPromise, ApiResponse } from '../src/js/api/types';
import Activities from '../src/js/modules/activities';
import Branches, { Branch } from '../src/js/modules/branches';
import Commits, { Commit } from '../src/js/modules/commits';
import Deployments, { Deployment } from '../src/js/modules/deployments';
import { FetchError } from '../src/js/modules/errors';
import { FORM_SUBMIT } from '../src/js/modules/forms';
import Projects, { Project } from '../src/js/modules/projects';
import Requests, { FetchEntityActionCreators } from '../src/js/modules/requests';
import { StateTree } from '../src/js/reducers';
import sagaCreator from '../src/js/sagas';

const testData = {
  allProjectsResponse: require('../json/projects.json') as ApiResponse,
  deploymentResponse: require('../json/deployment-7.json') as ApiResponse,
  branchResponse: require('../json/branch-1.json') as ApiResponse,
  commitResponse: require('../json/commit.json') as ApiResponse,
  projectResponse: require('../json/project-1.json') as ApiResponse,
  activitiesResponse: require('../json/activities.json') as ApiResponse,
  projectBranchesResponse: require('../json/project-1-branches.json') as ApiResponse,
  branchCommitsResponse: require('../json/branch-1-commits.json') as ApiResponse,
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
      fetchForProject: (id: string) => Promise.resolve({ response: {} }),
    },
    Commit: {
      fetch: (id: string) => Promise.resolve({ response: {} }),
      fetchForBranch: (id: string) => Promise.resolve({ response: {} }),
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
    'watchForLoadBranchesForProject',
    Branches.actions.LOAD_BRANCHES_FOR_PROJECT,
    sagas.watchForLoadBranchesForProject(),
    sagas.loadBranchesForProject,
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
    'watchForLoadCommitsForBranch',
    Commits.actions.LOAD_COMMITS_FOR_BRANCH,
    sagas.watchForLoadCommitsForBranch(),
    sagas.loadCommitsForBranch,
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
    selector: (state: StateTree, id: string) => Branch | Commit | Deployment | Project | FetchError | undefined,
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
    const action = {
      type: Activities.actions.LOAD_ACTIVITIES,
      count: 10,
      until: 283751293,
    };

    it('fetches activities and ensures data', () => {
      const iterator = sagas.loadActivities(action);

      expect(iterator.next().value).to.deep.equal(
        call(sagas.fetchActivities, action.count, action.until)
      );

      expect(iterator.next(true).value).to.deep.equal(
        fork(sagas.ensureActivitiesRelatedDataLoaded)
      );

      expect(iterator.next().done).to.equal(true);
    });

    it('does not ensure data if fetching fails', () => {
      const iterator = sagas.loadActivities(action);

      expect(iterator.next().value).to.deep.equal(
        call(sagas.fetchActivities, action.count, action.until)
      );

      expect(iterator.next(false).done).to.equal(true);
    });
  });

  describe('loadActivitiesForProject', () => {
    const id = 'id';
    const count = 10;
    const until = undefined;
    const action = {
      type: Activities.actions.LOAD_ACTIVITIES_FOR_PROJECT,
      id,
      count,
      until,
    };

    it('fetches projects and ensures data', () => {
      const iterator = sagas.loadActivitiesForProject(action);

      expect(iterator.next().value).to.deep.equal(
        call(sagas.fetchActivitiesForProject, id, count, until)
      );

      expect(iterator.next(true).value).to.deep.equal(
        fork(sagas.ensureActivitiesRelatedDataLoaded)
      );

      expect(iterator.next().done).to.equal(true);
    });

    it('does not ensure data if fetching fails', () => {
      const iterator = sagas.loadActivitiesForProject(action);

      expect(iterator.next().value).to.deep.equal(
        call(sagas.fetchActivitiesForProject, id, count, until)
      );

      expect(iterator.next(false).done).to.equal(true);
    });
  });

  describe('loadBranchesForProject', () => {
    const action = {
      type: Branches.actions.LOAD_BRANCHES_FOR_PROJECT,
      id: '1',
    };

    it('calls fetchBranchesForProject if branch exists', () => {
      const iterator = sagas.loadBranchesForProject(action);

      expect(iterator.next().value).to.deep.equal(
        select(Projects.selectors.getProject, action.id)
      );

      expect(iterator.next({ id: action.id }).value).to.deep.equal(
        call(sagas.fetchBranchesForProject, action.id)
      );
    });

    it('calls fetchBranchesForProject only once branch has been received', () => {
      const iterator = sagas.loadBranchesForProject(action);

      expect(iterator.next().value).to.deep.equal(
        select(Projects.selectors.getProject, action.id)
      );

      expect(iterator.next().value).to.deep.equal(
        take(Projects.actions.STORE_PROJECTS)
      );

      expect(iterator.next({ entities: [{ id: 'foo' }]}).value).to.deep.equal(
        take(Projects.actions.STORE_PROJECTS)
      );

      expect(iterator.next({ entities: [{ id: 'bar' }, { id: action.id }]}).value).to.deep.equal(
        call(sagas.fetchBranchesForProject, action.id)
      );
    });

    it('ensures needed data exists if fetch was a success', () => {
      const iterator = sagas.loadBranchesForProject(action);

      iterator.next();
      iterator.next({ id: action.id });
      expect(iterator.next(true).value).to.deep.equal(
        fork(sagas.ensureBranchesForProjectRelatedDataLoaded, action.id)
      );
      expect(iterator.next().done).to.equal(true);
    });

    it('does not ensure needed data if fetch was a failure', () => {
      const iterator = sagas.loadBranchesForProject(action);

      iterator.next();
      iterator.next({ id: action.id });
      expect(iterator.next(false).done).to.equal(true);
    });
  });

  describe('loadCommitsForBranch', () => {
    const action = {
      type: Commits.actions.LOAD_COMMITS_FOR_BRANCH,
      id: '1',
      count: 10,
      until: 1234567,
    };

    it('calls fetchCommitsForBranch if branch exists', () => {
      const iterator = sagas.loadCommitsForBranch(action);

      expect(iterator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, action.id)
      );

      expect(iterator.next({ id: action.id }).value).to.deep.equal(
        call(sagas.fetchCommitsForBranch, action.id, action.count, action.until)
      );
    });

    it('calls fetchCommitsForBranch only once branch has been received', () => {
      const iterator = sagas.loadCommitsForBranch(action);

      expect(iterator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, action.id)
      );

      expect(iterator.next().value).to.deep.equal(
        take(Branches.actions.STORE_BRANCHES)
      );

      expect(iterator.next({ entities: [{ id: 'foo' }]}).value).to.deep.equal(
        take(Branches.actions.STORE_BRANCHES)
      );

      expect(iterator.next({ entities: [{ id: 'bar' }, { id: action.id }]}).value).to.deep.equal(
        call(sagas.fetchCommitsForBranch, action.id, action.count, action.until)
      );
    });

    it('ensures needed data exists if fetch was a success', () => {
      const iterator = sagas.loadCommitsForBranch(action);

      iterator.next();
      iterator.next({ id: action.id });
      expect(iterator.next(true).value).to.deep.equal(
        fork(sagas.ensureCommitsForBranchRelatedDataLoaded, action.id)
      );
      expect(iterator.next().done).to.equal(true);
    });

    it('does not ensure needed data if fetch was a failure', () => {
      const iterator = sagas.loadCommitsForBranch(action);

      iterator.next();
      iterator.next({ id: action.id });
      expect(iterator.next(false).done).to.equal(true);
    });
  });

  interface StoreAction extends Action {
    entities: any[];
  }

  const testEntityFetcher = (
    name: string,
    response: ApiResponse,
    responseNoInclude: ApiResponse,
    requestActionCreators: FetchEntityActionCreators,
    fetcher: (id: string) => IterableIterator<Effect>,
    apiCall: (id: string) => ApiPromise,
    converter: (responseEntities: any[]) => any[],
    storeActionCreator: (entities: any[]) => StoreAction,
  ) => {
    describe(name, () => {
      const id = 'id';

      it('fetches, converts and stores entity', () => {
        const iterator = fetcher(id);
        const objectsToStore = [{ id: '1' }, { id: '2' }];

        expect(iterator.next().value).to.deep.equal(
          put(requestActionCreators.REQUEST.actionCreator(id))
        );

        expect(iterator.next().value).to.deep.equal(
          call(apiCall, id)
        );

        expect(iterator.next({ response: responseNoInclude }).value).to.deep.equal(
          put(requestActionCreators.SUCCESS.actionCreator(id))
        );

        expect(iterator.next().value).to.deep.equal(
          call(converter, responseNoInclude.data)
        );

        expect(iterator.next(objectsToStore).value).to.deep.equal(
          put(storeActionCreator(objectsToStore))
        );

        const endResult = iterator.next();
        expect(endResult.done).to.equal(true);
        expect(endResult.value).to.equal(true);
      });

      it('fetches and stores included data', () => {
        const iterator = fetcher(id);

        expect(iterator.next().value).to.deep.equal(
          put(requestActionCreators.REQUEST.actionCreator(id))
        );

        expect(iterator.next().value).to.deep.equal(
          call(apiCall, id)
        );

        expect(iterator.next({ response }).value).to.deep.equal(
          put(requestActionCreators.SUCCESS.actionCreator(id))
        );

        if (response.included && response.included.length > 0) {
          expect(iterator.next().value).to.deep.equal(
            call(sagas.storeIncludedEntities, response.included)
          );
        }
      });

      it('throws an error on failure', () => {
        const errorMessage = 'an error message';
        const details = 'a detailed error message';
        const iterator = fetcher(id);

        expect(iterator.next().value).to.deep.equal(
          put(requestActionCreators.REQUEST.actionCreator(id))
        );

        expect(iterator.next().value).to.deep.equal(
          call(apiCall, id)
        );

        expect(iterator.next({ error: errorMessage, details }).value).to.deep.equal(
          put(requestActionCreators.FAILURE.actionCreator(id, errorMessage, details))
        );

        const endResult = iterator.next();

        expect(endResult.done).to.equal(true);
        expect(endResult.value).to.equal(false);
      });
    });
  };

  testEntityFetcher(
    'fetchDeployment',
    testData.deploymentResponse,
    { data: testData.deploymentResponse.data },
    Requests.actions.Deployments.LoadDeployment,
    sagas.fetchDeployment,
    api.Deployment.fetch,
    Converter.toDeployments,
    Deployments.actions.storeDeployments,
  );

  testEntityFetcher(
    'fetchBranch',
    testData.branchResponse,
    { data: testData.branchResponse.data },
    Requests.actions.Branches.LoadBranch,
    sagas.fetchBranch,
    api.Branch.fetch,
    Converter.toBranches,
    Branches.actions.storeBranches,
  );

  testEntityFetcher(
    'fetchCommit',
    testData.commitResponse,
    { data: testData.commitResponse.data },
    Requests.actions.Commits.LoadCommit,
    sagas.fetchCommit,
    api.Commit.fetch,
    Converter.toCommits,
    Commits.actions.storeCommits,
  );

  testEntityFetcher(
    'fetchProject',
    testData.projectResponse,
    { data: testData.projectResponse.data },
    Requests.actions.Projects.LoadProject,
    sagas.fetchProject,
    api.Project.fetch,
    Converter.toProjects,
    Projects.actions.storeProjects,
  );

  describe('fetchActivities', () => {
    const count = 10;
    const until = 12523523623;

    it('fetches, converts and stores all activities', () => {
      const response = testData.activitiesResponse;
      const iterator = sagas.fetchActivities(count, until);
      const objects = [{ id: '1' }, { id: '2' }];

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Activities.LoadAllActivities.REQUEST.actionCreator())
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Activity.fetchAll, count, until)
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        put(Requests.actions.Activities.LoadAllActivities.SUCCESS.actionCreator())
      );

      expect(iterator.next().value).to.deep.equal(
        call(Converter.toActivities, response.data)
      );

      expect(iterator.next(objects).value).to.deep.equal(
        put(Activities.actions.storeActivities(objects as any))
      );

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('throws an error on failure', () => {
      const errorMessage = 'an error message';
      const iterator = sagas.fetchActivities(count, until);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Activities.LoadAllActivities.REQUEST.actionCreator())
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Activity.fetchAll, count, until)
      );

      expect(iterator.next({ error: errorMessage }).value).to.deep.equal(
        put(Requests.actions.Activities.LoadAllActivities.FAILURE.actionCreator(errorMessage))
      );

      const result = iterator.next();

      expect(result.value).to.equal(false);
      expect(result.done).to.equal(true);
    });
  });

  describe('fetchActivitiesForProject', () => {
    const id = 'id';
    const count = 10;
    const until = undefined;

    it('fetches, converts and stores activities', () => {
      const response = testData.activitiesResponse;
      const iterator = sagas.fetchActivitiesForProject(id, count, until);
      const objects = [{ id: '1' }, { id: '2' }];

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Activities.LoadActivitiesForProject.REQUEST.actionCreator(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Activity.fetchAllForProject, id, count, until)
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        put(Requests.actions.Activities.LoadActivitiesForProject.SUCCESS.actionCreator(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(Converter.toActivities, response.data)
      );

      expect(iterator.next(objects).value).to.deep.equal(
        put(Activities.actions.storeActivities(objects as any))
      );

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('throws an error on failure', () => {
      const errorMessage = 'an error message';
      const iterator = sagas.fetchActivitiesForProject(id, count, until);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Activities.LoadActivitiesForProject.REQUEST.actionCreator(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Activity.fetchAllForProject, id, count, until)
      );

      expect(iterator.next({ error: errorMessage }).value).to.deep.equal(
        put(Requests.actions.Activities.LoadActivitiesForProject.FAILURE.actionCreator(id, errorMessage))
      );

      const result = iterator.next();

      expect(result.value).to.equal(false);
      expect(result.done).to.equal(true);
    });
  });

  describe('fetchAllProjects', () => {
    it('fetches, converts and stores all projects', () => {
      const response = { data: testData.allProjectsResponse };
      const iterator = sagas.fetchAllProjects();
      const objects = [{ id: '1' }, { id: '2' }];

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Projects.LoadAllProjects.REQUEST.actionCreator())
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Project.fetchAll)
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        put(Requests.actions.Projects.LoadAllProjects.SUCCESS.actionCreator())
      );

      expect(iterator.next().value).to.deep.equal(
        call(Converter.toProjects, response.data)
      );

      expect(iterator.next(objects).value).to.deep.equal(
        put(Projects.actions.storeProjects(objects as any))
      );

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('throws an error on failure', () => {
      const errorMessage = 'an error message';
      const iterator = sagas.fetchAllProjects();

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Projects.LoadAllProjects.REQUEST.actionCreator())
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Project.fetchAll)
      );

      expect(iterator.next({ error: errorMessage }).value).to.deep.equal(
        put(Requests.actions.Projects.LoadAllProjects.FAILURE.actionCreator(errorMessage))
      );

      const result = iterator.next();

      expect(result.value).to.equal(false);
      expect(result.done).to.equal(true);
    });
  });

  describe('fetchBranchesForProject', () => {
    const id = 'id';

    it('fetches, converts and stores branches', () => {
      const response = { data: testData.projectBranchesResponse.data };
      const iterator = sagas.fetchBranchesForProject(id);
      const objects = [{ id: '1' }, { id: '2' }, { id: '3' }];

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Branches.LoadBranchesForProject.REQUEST.actionCreator(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Branch.fetchForProject, id)
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        put(Requests.actions.Branches.LoadBranchesForProject.SUCCESS.actionCreator(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(Converter.toBranches, response.data)
      );

      expect(iterator.next(objects).value).to.deep.equal(
        put(Branches.actions.storeBranches(objects as any))
      );

      expect(iterator.next().value).to.deep.equal(
        put(Projects.actions.addBranchesToProject(id, ['1', '2', '3']))
      );

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('fetches and stores included data', () => {
      const response = testData.projectBranchesResponse;
      const iterator = sagas.fetchBranchesForProject(id);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Branches.LoadBranchesForProject.REQUEST.actionCreator(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Branch.fetchForProject, id)
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        put(Requests.actions.Branches.LoadBranchesForProject.SUCCESS.actionCreator(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(sagas.storeIncludedEntities, response.included)
      );
    });

    it('throws an error on failure', () => {
      const errorMessage = 'an error message';
      const iterator = sagas.fetchBranchesForProject(id);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Branches.LoadBranchesForProject.REQUEST.actionCreator(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Branch.fetchForProject, id)
      );

      expect(iterator.next({ error: errorMessage }).value).to.deep.equal(
        put(Requests.actions.Branches.LoadBranchesForProject.FAILURE.actionCreator(id, errorMessage))
      );

      const result = iterator.next();

      expect(result.value).to.equal(false);
      expect(result.done).to.equal(true);
    });
  });

  describe('fetchCommitsForBranch', () => {
    const id = 'id';

    it('fetches, converts and stores commits', () => {
      const response = { data: testData.branchCommitsResponse.data };
      const count = 10;
      const until = undefined;
      const iterator = sagas.fetchCommitsForBranch(id, count, until);
      const objects = [{ id: '1' }, { id: '2' }, { id: '3' }];

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Commits.LoadCommitsForBranch.REQUEST.actionCreator(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Commit.fetchForBranch, id, count, until)
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        put(Requests.actions.Commits.LoadCommitsForBranch.SUCCESS.actionCreator(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(Converter.toCommits, response.data)
      );

      expect(iterator.next(objects).value).to.deep.equal(
        put(Commits.actions.storeCommits(objects as any))
      );

      expect(iterator.next().value).to.deep.equal(
        put(Branches.actions.addCommitsToBranch(
          id,
          ['aacceeff02', '12354124', '2543452', '098325343', '29832572fc1', '29752a385'],
          count,
        ))
      );

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('fetches and stores included data', () => {
      const response = testData.branchCommitsResponse;
      const count = 10;
      const until = undefined;
      const iterator = sagas.fetchCommitsForBranch(id, count, until);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Commits.LoadCommitsForBranch.REQUEST.actionCreator(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Commit.fetchForBranch, id, count, until)
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        put(Requests.actions.Commits.LoadCommitsForBranch.SUCCESS.actionCreator(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(sagas.storeIncludedEntities, response.included)
      );
    });

    it('throws an error on failure', () => {
      const errorMessage = 'an error message';
      const detailedMessage = 'detailed message';
      const count = 10;
      const until = undefined;
      const iterator = sagas.fetchCommitsForBranch(id, count, until);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Commits.LoadCommitsForBranch.REQUEST.actionCreator(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Commit.fetchForBranch, id, count, until)
      );

      expect(iterator.next({ error: errorMessage, details: detailedMessage }).value).to.deep.equal(
        put(Requests.actions.Commits.LoadCommitsForBranch.FAILURE.actionCreator(id, errorMessage, detailedMessage))
      );

      const result = iterator.next();

      expect(result.value).to.equal(false);
      expect(result.done).to.equal(true);
    });
  });

  describe('ensureActivitiesRelatedDataLoaded', () => {
    it('does nothing', () => {
      const iterator = sagas.ensureActivitiesRelatedDataLoaded();

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
        latestActivityTimestamp: 123456789,
        latestSuccessfullyDeployedCommit: 'abc',
        activeUsers: [],
      };
      const commit: Commit = {
        id: 'abc',
        message: '',
        author: { email: '', timestamp: 1 },
        committer: { email: '', timestamp: 1 },
        hash: 'abc',
        deployment: 'foo',
      };

      expect(iterator.next().value).to.deep.equal(
        select(Projects.selectors.getProject, id)
      );

      expect(iterator.next(project).value).to.deep.equal(
        call(sagas.fetchIfMissing, 'commits', project.latestSuccessfullyDeployedCommit)
      );

      expect(iterator.next(commit).value).to.deep.equal(
        call(sagas.fetchIfMissing, 'deployments', commit.deployment)
      );

      expect(iterator.next().done).to.equal(true);
    });

    it('also accepts a Project as a parameter', () => {
      const project: Project = {
        id: '1',
        name: 'name',
        latestActivityTimestamp: 123456789,
        latestSuccessfullyDeployedCommit: 'abc',
        activeUsers: [],
      };

      const iterator = sagas.ensureProjectRelatedDataLoaded(project);

      const commit: Commit = {
        id: 'abc',
        message: '',
        author: { email: '', timestamp: 1 },
        committer: { email: '', timestamp: 1 },
        hash: 'abc',
        deployment: 'foo',
      };

      expect(iterator.next(project).value).to.deep.equal(
        call(sagas.fetchIfMissing, 'commits', project.latestSuccessfullyDeployedCommit)
      );

      expect(iterator.next(commit).value).to.deep.equal(
        call(sagas.fetchIfMissing, 'deployments', commit.deployment)
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
        latestCommit: 'lc',
        latestSuccessfullyDeployedCommit: 'lsdc',
        buildErrors: [],
        project: '1',
        commits: ['lc', 'lsdc'],
        allCommitsLoaded: false,
      };
      const latestSuccessfullyDeployedCommit: Commit = {
        id: 'abc',
        message: '',
        author: { email: '', timestamp: 1 },
        committer: { email: '', timestamp: 1 },
        hash: 'abc',
        deployment: 'foo',
      };

      expect(iterator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, id)
      );

      expect(iterator.next(branch).value).to.deep.equal(
        call(sagas.fetchIfMissing, 'projects', '1')
      );

      expect(iterator.next().value).to.deep.equal(
        call(sagas.fetchIfMissing, 'commits', branch.latestSuccessfullyDeployedCommit)
      );

      expect(iterator.next(latestSuccessfullyDeployedCommit).value).to.deep.equal(
        call(sagas.fetchIfMissing, 'deployments', latestSuccessfullyDeployedCommit.deployment)
      );

      expect(iterator.next().value).to.deep.equal(
        call(sagas.fetchIfMissing, 'commits', branch.latestCommit)
      );

      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('ensureBranchesForProjectRelatedDataLoaded', () => {
    it('fetches the latest commits and deployment for each branch', () => {
      const projectId = '1';
      const branches: Branch[] = [
        {
          id: 'b1',
          latestSuccessfullyDeployedCommit: 'b1sc',
          project: projectId,
          buildErrors: [],
          name: 'branch-1',
          latestCommit: 'b1lc',
          commits: ['b1lc', 'b1sc'],
          allCommitsLoaded: false,
        },
        {
          id: 'b2',
          latestSuccessfullyDeployedCommit: 'b2sc',
          project: projectId,
          buildErrors: [],
          name: 'branch-2',
          latestCommit: 'b2sc',
          commits: ['b2sc'],
          allCommitsLoaded: false,
        },
        {
          id: 'b3',
          project: projectId,
          buildErrors: [],
          name: 'branch-3',
          commits: [],
          allCommitsLoaded: true,
        },
      ];
      const deployedCommits: Commit[] = [
        {
          id: 'b1sc',
          message: '',
          author: { email: '', timestamp: 1 },
          committer: { email: '', timestamp: 1 },
          hash: 'abc',
          deployment: 'foo1',
        },
        {
          id: 'b2sc',
          message: '',
          author: { email: '', timestamp: 1 },
          committer: { email: '', timestamp: 1 },
          hash: 'xyz',
          deployment: 'foo2',
        },
      ];

      const iterator = sagas.ensureBranchesForProjectRelatedDataLoaded(projectId);
      expect(iterator.next().value).to.deep.equal(
        select(Branches.selectors.getBranchesForProject, projectId)
      );

      expect(iterator.next(branches).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'commits', branches[0].latestSuccessfullyDeployedCommit),
          call(sagas.fetchIfMissing, 'commits', branches[1].latestSuccessfullyDeployedCommit),
        ]
      );

      expect(iterator.next(deployedCommits).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'deployments', deployedCommits[0].deployment),
          call(sagas.fetchIfMissing, 'deployments', deployedCommits[1].deployment),
        ]
      );

      expect(iterator.next().value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'commits', branches[0].latestCommit),
          call(sagas.fetchIfMissing, 'commits', branches[1].latestCommit),
        ]
      );

      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('ensureDeploymentRelatedDataLoaded', () => {
    // Nothing to do
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

  describe('ensureCommitsForBranchRelatedDataLoaded', () => {
    it('ensures the associated deployments have been fetched', () => {
      const branchId = '1';

      const commits: Commit[] = [
        {
          id: 'c1',
          message: '',
          author: { email: '', timestamp: 1 },
          committer: { email: '', timestamp: 1 },
          hash: 'abc',
          deployment: 'foo1',
        },
        {
          id: 'c2',
          message: '',
          author: { email: '', timestamp: 1 },
          committer: { email: '', timestamp: 1 },
          hash: 'xyz',
        },
        {
          id: 'c3',
          message: '',
          author: { email: '', timestamp: 1 },
          committer: { email: '', timestamp: 1 },
          hash: 'cdsg',
          deployment: 'foo3',
        },
      ];

      const branch: Branch = {
        id: 'b',
        project: '1',
        buildErrors: [],
        name: 'branchname',
        commits: ['c1', 'c2', 'c3'],
        allCommitsLoaded: false,
      };

      const iterator = sagas.ensureCommitsForBranchRelatedDataLoaded(branchId);
      expect(iterator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, branchId)
      );

      expect(iterator.next(branch).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'commits', branch.commits[0]),
          call(sagas.fetchIfMissing, 'commits', branch.commits[1]),
          call(sagas.fetchIfMissing, 'commits', branch.commits[2]),
        ]
      );

      expect(iterator.next(commits).value).to.deep.equal(
        [
          call(sagas.fetchIfMissing, 'deployments', commits[0].deployment),
          call(sagas.fetchIfMissing, 'deployments', commits[2].deployment),
        ]
      );

      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('fetchIfMissing', () => {
    const testFetchIfMissing = (
      type: ApiEntityTypeString,
      selector: (state: StateTree, id: string) => Branch | Commit | Deployment | Project | FetchError | undefined,
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
      const deploymentObjects = [{ id: '1' }];
      const commitsEntities = includedData.filter(entity => entity.type === 'commits');
      const commitObjects = [{ id: '2' }];

      expect(iterator.next().value).to.deep.equal(
        call(Converter.toDeployments, deploymentsEntities)
      );

      expect(iterator.next(deploymentObjects).value).to.deep.equal(
        put(Deployments.actions.storeDeployments(<any> deploymentObjects))
      );

      expect(iterator.next().value).to.deep.equal(
        call(Converter.toCommits, commitsEntities)
      );

      expect(iterator.next(commitObjects).value).to.deep.equal(
        put(Commits.actions.storeCommits(<any> commitObjects))
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
        put(Requests.actions.Projects.CreateProject.REQUEST.actionCreator(name))
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
      const object = [{ id: '1' }];

      iterator.next();
      iterator.next();

      expect(iterator.next({ response }).value).to.deep.equal(
        put(Requests.actions.Projects.CreateProject.SUCCESS.actionCreator(name))
      );

      expect(iterator.next().value).to.deep.equal(
        call(Converter.toProjects, response.data)
      );

      expect(iterator.next(object).value).to.deep.equal(
        put(Projects.actions.storeProjects(object as any))
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
        put(Requests.actions.Projects.CreateProject.FAILURE.actionCreator(name, error))
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
        put(Requests.actions.Projects.DeleteProject.REQUEST.actionCreator(id))
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
        put(Requests.actions.Projects.DeleteProject.SUCCESS.actionCreator(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(resolve)
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
        put(Requests.actions.Projects.DeleteProject.FAILURE.actionCreator(id, error))
      );

      expect(iterator.next().value).to.deep.equal(
        call(reject)
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
        put(Requests.actions.Projects.EditProject.REQUEST.actionCreator(id))
      );
    });

    it('calls the API editProject function', () => {
      const iterator = sagas.editProject(action);

      iterator.next();

      expect(iterator.next().value).to.deep.equal(
        call(api.Project.edit, id, { name, description })
      );
    });

    it('saves and converts the returned project and generates a .success action if the submission succeeds', () => {
      const iterator = sagas.editProject(action);
      const response = { data: { id, attributes: { name, description }}};
      const object = [{ id: '1' }];

      iterator.next();
      iterator.next();

      expect(iterator.next({ response }).value).to.deep.equal(
        put(Requests.actions.Projects.EditProject.SUCCESS.actionCreator(id))
      );

      expect(iterator.next().value).to.deep.equal(
        call(Converter.toProjects, response.data)
      );

      expect(iterator.next(object).value).to.deep.equal(
        put(Projects.actions.storeProjects(object as any))
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
        put(Requests.actions.Projects.EditProject.FAILURE.actionCreator(id, error))
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
