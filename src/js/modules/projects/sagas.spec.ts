// tslint:disable:no-object-literal-type-assertion

import { expect } from 'chai';
import { call, fork, put, select } from 'redux-saga/effects';

import { toProjects } from '../../api/convert';
import { Commit } from '../commits';
import Requests from '../requests';
import Projects, {
  CreateProjectAction,
  DeleteProjectAction,
  EditProjectAction,
  LoadAllProjectsAction,
  Project,
} from './index';

import { createApi, testData, testEntityFetcherSaga, testLoaderSaga } from '../../../../test/test-utils';
import { fetchIfMissing } from '../../sagas/utils';
import createSagas from './sagas';

describe('Projects sagas', () => {
  const api = createApi();
  const sagaFunctions = createSagas(api).functions;

  testLoaderSaga(
    'loadProject',
    sagaFunctions.loadProject,
    Projects.selectors.getProject,
    sagaFunctions.fetchProject,
    sagaFunctions.ensureProjectRelatedDataLoaded,
  );

  describe('loadAllProjects', () => {
    const teamId = '1';
    const action: LoadAllProjectsAction = {
      type: Projects.actions.LOAD_ALL_PROJECTS,
      teamId,
    };

    it('fetches projects and ensures data', () => {
      const iterator = sagaFunctions.loadAllProjects(action);

      expect(iterator.next().value).to.deep.equal(
        call(sagaFunctions.fetchAllProjects, teamId),
      );

      expect(iterator.next(true).value).to.deep.equal(
        fork(sagaFunctions.ensureAllProjectsRelatedDataLoaded),
      );

      expect(iterator.next().done).to.equal(true);
    });

    it('does not ensure data if fetching fails', () => {
      const iterator = sagaFunctions.loadAllProjects(action);

      expect(iterator.next().value).to.deep.equal(
        call(sagaFunctions.fetchAllProjects, teamId),
      );

      expect(iterator.next(false).done).to.equal(true);
    });
  });

  testEntityFetcherSaga(
    'fetchProject',
    testData.projectResponse,
    { data: testData.projectResponse.data },
    Requests.actions.Projects.LoadProject,
    sagaFunctions.fetchProject,
    api.Project.fetch,
    toProjects,
    Projects.actions.storeProjects,
  );

  describe('fetchAllProjects', () => {
    const teamId = 'foo';

    it('fetches, converts and stores all projects', () => {
      const response = { data: testData.allProjectsResponse };
      const iterator = sagaFunctions.fetchAllProjects(teamId);
      const objects = [{ id: '1' }, { id: '2' }];

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Projects.LoadAllProjects.REQUEST.actionCreator()),
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Project.fetchAll, teamId),
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        call(toProjects, response.data as any),
      );

      expect(iterator.next(objects).value).to.deep.equal(
        put(Projects.actions.storeProjects(objects as any)),
      );

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Projects.LoadAllProjects.SUCCESS.actionCreator()),
      );

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('throws an error on failure', () => {
      const errorMessage = 'an error message';
      const iterator = sagaFunctions.fetchAllProjects(teamId);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Projects.LoadAllProjects.REQUEST.actionCreator()),
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Project.fetchAll, teamId),
      );

      expect(iterator.next({ error: errorMessage }).value).to.deep.equal(
        put(Requests.actions.Projects.LoadAllProjects.FAILURE.actionCreator(errorMessage)),
      );

      const result = iterator.next();

      expect(result.value).to.equal(false);
      expect(result.done).to.equal(true);
    });
  });

  describe('ensureAllProjectsRelatedDataLoaded', () => {
    it('makes sure deployments, commits, branches and projects exist for all activities', () => {
      const iterator = sagaFunctions.ensureAllProjectsRelatedDataLoaded();
      const projects: Project[] = [
        {
          id: '1',
          name: 'name',
          branches: ['1', '2'],
          activeUsers: [],
          repoUrl: 'http://mock.repo.url/project.git',
          token: 'testtoken',
        },
        {
          id: '2',
          name: 'name2',
          branches: ['3'],
          activeUsers: [],
          repoUrl: 'http://mock.repo.url/project.git',
          token: 'testtoken',
        },
      ];

      expect(iterator.next().value).to.deep.equal(
        select(Projects.selectors.getProjects),
      );

      expect(iterator.next(projects).value).to.deep.equal(
        call(sagaFunctions.ensureProjectRelatedDataLoaded, projects[0]),
      );

      expect(iterator.next().value).to.deep.equal(
        call(sagaFunctions.ensureProjectRelatedDataLoaded, projects[1]),
      );

      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('ensureProjectRelatedDataLoaded', () => {
    it('makes sure branches and latest deployments exist for the project', () => {
      const id = '1';
      const iterator = sagaFunctions.ensureProjectRelatedDataLoaded(id);
      const project: Project = {
        id: '1',
        name: 'name',
        latestActivityTimestamp: 123456789,
        latestSuccessfullyDeployedCommit: 'abc',
        activeUsers: [],
        repoUrl: 'http://mock.repo.url/project.git',
        token: 'testtoken',
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
        select(Projects.selectors.getProject, id),
      );

      expect(iterator.next(project).value).to.deep.equal(
        call(fetchIfMissing, 'commits', project.latestSuccessfullyDeployedCommit),
      );

      expect(iterator.next(commit).value).to.deep.equal(
        call(fetchIfMissing, 'deployments', commit.deployment),
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
        repoUrl: 'http://mock.repo.url/project.git',
        token: 'testtoken',
      };

      const iterator = sagaFunctions.ensureProjectRelatedDataLoaded(project);

      const commit: Commit = {
        id: 'abc',
        message: '',
        author: { email: '', timestamp: 1 },
        committer: { email: '', timestamp: 1 },
        hash: 'abc',
        deployment: 'foo',
      };

      expect(iterator.next(project).value).to.deep.equal(
        call(fetchIfMissing, 'commits', project.latestSuccessfullyDeployedCommit),
      );

      expect(iterator.next(commit).value).to.deep.equal(
        call(fetchIfMissing, 'deployments', commit.deployment),
      );

      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('createProject', () => {
    const name = 'projectName';
    const description = 'projectDescription';
    const projectTemplate = undefined;
    const teamId = '1';
    const action: CreateProjectAction = {
      type: 'PROJECTS/CREATE_PROJECT',
      payload: {
        teamId,
        name,
        description,
        projectTemplate,
      },
    };

    it('stores information that a request has been started', () => {
      const iterator = sagaFunctions.createProject(action);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Projects.CreateProject.REQUEST.actionCreator(name)),
      );
    });

    it('calls the API createProject function', () => {
      const iterator = sagaFunctions.createProject(action);

      iterator.next();

      expect(iterator.next().value).to.deep.equal(
        call(api.Project.create, teamId, name, description, projectTemplate),
      );
    });

    it('saves the returned project and generates a .success action if the submission succeeds', () => {
      const iterator = sagaFunctions.createProject(action);
      const projectId = '58';
      const response = { data: { id: projectId, type: 'projects' } };
      const object = [{ id: '1' }];

      iterator.next();
      iterator.next();

      expect(iterator.next({ response }).value).to.deep.equal(
        call(toProjects, response.data as any),
      );

      expect(iterator.next(object).value).to.deep.equal(
        put(Projects.actions.storeProjects(object as any)),
      );

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Projects.CreateProject.SUCCESS.actionCreator(object[0], name)),
      );

      const val = iterator.next();
      expect(val.value).to.equal(true);
      expect(val.done).to.equal(true);
    });

    it('generates a .failure action if the submission fails', () => {
      const iterator = sagaFunctions.createProject(action);
      const error = 'error!';

      iterator.next();
      iterator.next();

      expect(iterator.next({ error }).value).to.deep.equal(
        put(Requests.actions.Projects.CreateProject.FAILURE.actionCreator(name, error)),
      );

      const val = iterator.next();
      expect(val.value).to.equal(false);
      expect(val.done).to.equal(true);
    });

    it('with template project');
  });

  describe('deleteProject', () => {
    const id = '23524';
    const resolve = () => ({});
    const reject = () => ({});
    const action: DeleteProjectAction = {
      type: 'PROJECTS/DELETE_PROJECT',
      id,
      resolve,
      reject,
    };

    it('stores information that a request has been started', () => {
      const iterator = sagaFunctions.deleteProject(action);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Projects.DeleteProject.REQUEST.actionCreator(id)),
      );
    });

    it('calls the API deleteProject function', () => {
      const iterator = sagaFunctions.deleteProject(action);

      iterator.next();

      expect(iterator.next().value).to.deep.equal(
        call(api.Project.delete, id),
      );
    });

    it('resolves the promise and generates a .success action if the deletion succeeds', () => {
      const iterator = sagaFunctions.deleteProject(action);
      const response = 'ok';

      iterator.next();
      iterator.next();

      expect(iterator.next({ response }).value).to.deep.equal(
        call(resolve),
      );

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Projects.DeleteProject.SUCCESS.actionCreator(id)),
      );

      const val = iterator.next();
      expect(val.value).to.equal(true);
      expect(val.done).to.equal(true);
    });

    it('generates a .failure action if the deletion fails', () => {
      const iterator = sagaFunctions.deleteProject(action);
      const error = 'error!';

      iterator.next();
      iterator.next();

      expect(iterator.next({ error }).value).to.deep.equal(
        call(reject),
      );

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Projects.DeleteProject.FAILURE.actionCreator(id, error)),
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
    const action: EditProjectAction = {
      type: 'PROJECTS/EDIT_PROJECT',
      payload: {
        id,
        name,
        description,
        activeUsers: [],
        repoUrl: '',
        token: 'testtoken',
      },
    };

    it('stores information that a request has been started', () => {
      const iterator = sagaFunctions.editProject(action);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Projects.EditProject.REQUEST.actionCreator(id)),
      );
    });

    it('calls the API editProject function', () => {
      const iterator = sagaFunctions.editProject(action);

      iterator.next();

      expect(iterator.next().value).to.deep.equal(
        call(api.Project.edit, id, { name, description }),
      );
    });

    it('saves and converts the returned project and generates a .success action if the submission succeeds', () => {
      const iterator = sagaFunctions.editProject(action);
      const response = { data: { id, attributes: { name, description }}};
      const object = [{ id: '1' }];

      iterator.next();
      iterator.next();

      expect(iterator.next({ response }).value).to.deep.equal(
        call(toProjects, response.data as any),
      );

      expect(iterator.next(object).value).to.deep.equal(
        put(Projects.actions.storeProjects(object as any)),
      );

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Projects.EditProject.SUCCESS.actionCreator(object[0])),
      );

      const val = iterator.next();
      expect(val.value).to.equal(true);
      expect(val.done).to.equal(true);
    });

    it('generates a .failure action if the submission fails', () => {
      const iterator = sagaFunctions.editProject(action);
      const error = 'error!';

      iterator.next();
      iterator.next();

      expect(iterator.next({ error }).value).to.deep.equal(
        put(Requests.actions.Projects.EditProject.FAILURE.actionCreator(id, error)),
      );

      const val = iterator.next();
      expect(val.value).to.equal(false);
      expect(val.done).to.equal(true);
    });
  });
});
