import {
  call,
  Effect,
  fork,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';

import { toProjects } from '../../api/convert';
import { Api } from '../../api/types';
import { logException } from '../../logger';
import {
  createCollectionFetcher,
  createEntityFetcher,
  createLoader,
  fetchIfMissing,
  storeIncludedEntities,
} from '../../sagas/utils';
import { Commit } from '../commits';
import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';
import {
  CREATE_PROJECT,
  DELETE_PROJECT,
  EDIT_PROJECT,
  FETCH_PROJECT,
  LOAD_ALL_PROJECTS,
  LOAD_PROJECT,
  storeProjects,
} from './actions';
import { getProject, getProjects } from './selectors';
import {
  CreateProjectAction,
  DeleteProjectAction,
  EditProjectAction,
  FetchProjectAction,
  LoadAllProjectsAction,
  Project,
} from './types';

export default function createSagas(api: Api) {
  const fetchProject = createEntityFetcher(
    Requests.actions.Projects.LoadProject,
    toProjects,
    storeProjects,
    api.Project.fetch,
  );

  const fetchAllProjects = createCollectionFetcher(
    Requests.actions.Projects.LoadAllProjects,
    toProjects,
    storeProjects,
    api.Project.fetchAll,
  );

  // ALL PROJECTS
  function* loadAllProjects(
    action: LoadAllProjectsAction,
  ): IterableIterator<Effect> {
    const { teamId } = action;
    const fetchSuccess = yield call(fetchAllProjects, teamId);
    if (fetchSuccess) {
      yield fork(ensureAllProjectsRelatedDataLoaded);
    }
  }

  function* ensureAllProjectsRelatedDataLoaded(): IterableIterator<
    Effect | Effect[]
  > {
    const projects: Project[] = yield select(getProjects);

    if (!projects) {
      logException('Error ensuring project', new Error('No projects found!'));

      return;
    }

    for (const project of projects) {
      yield call(ensureProjectRelatedDataLoaded, project);
    }
  }

  // PROJECT
  const loadProject = createLoader(
    getProject,
    fetchProject,
    ensureProjectRelatedDataLoaded,
  );

  function* ensureProjectRelatedDataLoaded(
    projectOrId: Project | string,
  ): IterableIterator<Effect | Effect[]> {
    const project: Project | FetchError | undefined = typeof projectOrId ===
      'string'
      ? yield select(getProject, projectOrId)
      : projectOrId;

    if (!project) {
      logException('Error ensuring project', new Error('No project found!'), {
        project,
      });

      return;
    }

    if (isFetchError(project)) {
      logException(
        'Error fetching project',
        new Error('Unable to fetch project!'),
        { project },
      );

      return;
    }

    if (project.latestSuccessfullyDeployedCommit) {
      const commit: Commit | FetchError | undefined = yield call(
        fetchIfMissing,
        'commits',
        project.latestSuccessfullyDeployedCommit,
      );
      if (commit && !isFetchError(commit) && commit.deployment) {
        yield call(fetchIfMissing, 'deployments', commit.deployment);
      }
    }
  }

  function* watchForLoadAllProjects(): IterableIterator<Effect> {
    while (true) {
      const action = yield take(LOAD_ALL_PROJECTS);
      // Block until it's done, skipping any further actions
      yield call(loadAllProjects, action);
    }
  }

  // CREATE PROJECT
  function* createProject(
    action: CreateProjectAction,
  ): IterableIterator<Effect> {
    const { name, description, projectTemplate, teamId } = action.payload;

    yield put(
      Requests.actions.Projects.CreateProject.REQUEST.actionCreator(name),
    );

    const {
      response,
      error,
      details,
      unauthorized,
    }: {
      response?: any;
      error?: string;
      details?: string;
      unauthorized?: boolean;
    } = yield call(
      api.Project.create,
      teamId,
      name,
      description,
      projectTemplate,
    );

    if (response) {
      if (response.included) {
        yield call(storeIncludedEntities, response.included);
      }

      // Store new project
      const projectObject: Project[] = yield call(toProjects, response.data);
      yield put(storeProjects(projectObject));

      // Notify form that creation was a success
      yield put(
        Requests.actions.Projects.CreateProject.SUCCESS.actionCreator(
          projectObject[0],
          name,
        ),
      );

      return true;
    } else {
      // Notify form that creation failed
      yield put(
        Requests.actions.Projects.CreateProject.FAILURE.actionCreator(
          name,
          error!,
          details,
          unauthorized,
        ),
      );

      return false;
    }
  }

  // Delete PROJECT
  function* deleteProject(
    action: DeleteProjectAction,
  ): IterableIterator<Effect> {
    const { id, resolve, reject } = action;

    yield put(
      Requests.actions.Projects.DeleteProject.REQUEST.actionCreator(id),
    );

    const { response, error, details, unauthorized } = yield call(
      api.Project.delete,
      id,
    );

    if (response) {
      yield call(resolve);
      yield put(
        Requests.actions.Projects.DeleteProject.SUCCESS.actionCreator(id),
      );

      return true;
    } else {
      yield call(reject);
      yield put(
        Requests.actions.Projects.DeleteProject.FAILURE.actionCreator(
          id,
          error,
          details,
          unauthorized,
        ),
      );

      return false;
    }
  }

  // Edit PROJECT
  function* editProject(action: EditProjectAction): IterableIterator<Effect> {
    const { id, name } = action.payload;
    // If we don't force description to exist, there would be no way to clear it when editing
    const description = action.payload.description || '';

    yield put(Requests.actions.Projects.EditProject.REQUEST.actionCreator(id));

    const { response, error, details, unauthorized } = yield call(
      api.Project.edit,
      id,
      { name, description },
    );

    if (response) {
      // Store edited project
      const projectObject = yield call(toProjects, response.data);
      yield put(storeProjects(projectObject));

      // Notify form that creation was a success
      yield put(
        Requests.actions.Projects.EditProject.SUCCESS.actionCreator(
          projectObject[0],
        ),
      );

      return true;
    } else {
      // Notify form that creation failed
      yield put(
        Requests.actions.Projects.EditProject.FAILURE.actionCreator(
          id,
          error,
          details,
          unauthorized,
        ),
      );

      return false;
    }
  }

  function* startFetchProject(action: FetchProjectAction) {
    yield call(fetchProject, action.id);
  }

  return {
    // For unit tests
    functions: {
      fetchProject,
      fetchAllProjects,
      ensureProjectRelatedDataLoaded,
      createProject,
      editProject,
      deleteProject,
      loadProject,
      loadAllProjects,
      ensureAllProjectsRelatedDataLoaded,
    },
    sagas: [
      takeEvery(LOAD_PROJECT, loadProject),
      fork(watchForLoadAllProjects),
      takeLatest(CREATE_PROJECT, createProject),
      takeLatest(DELETE_PROJECT, deleteProject),
      takeLatest(EDIT_PROJECT, editProject),
      takeEvery(FETCH_PROJECT, startFetchProject),
    ],
  };
}
