import { ActionCreator } from 'redux';
import { Effect, call, fork, put, select, take } from 'redux-saga/effects';

import * as api from '../api';

import Branches from '../modules/branches';
import Commits from '../modules/commits';
import Deployments from '../modules/deployments';
import Projects from '../modules/projects';

interface IncludedEntity {
  type: "commits" | "deployments" | "projects" | "branches";
  id: string;
  attributes: any;
}

function* storeIncludedEntities(entities: IncludedEntity[]): IterableIterator<Effect> {
  const typeActionCreators: {[type: string]: ActionCreator<any>} = {
    projects: Projects.actions.StoreProjects,
    deployments: Deployments.actions.StoreDeployments,
    commits: Commits.actions.StoreCommits,
    branches: Branches.actions.StoreBranches,
  };

  // Can't use forEach because of generators
  for (const type in typeActionCreators) {
    if (typeActionCreators.hasOwnProperty(type)) {
      const includedEntities = entities.filter(entity => entity.type === type);
      if (includedEntities.length > 0) {
        yield put(typeActionCreators[type](includedEntities));
      }
    }
  }
}

// Fetchers: Fetch the data from the server and store it into actions.
function* fetchProjects(): IterableIterator<Effect> {
  yield put(Projects.actions.FetchProjects.request());

  const { response, error } = yield call(api.fetchProjects);

  if (response) {
    yield call(storeIncludedEntities, response.included);
    yield put(Projects.actions.FetchProjects.success(response.data));
  } else {
    yield put(Projects.actions.FetchProjects.failure(error));
  }
}

function* fetchProject(id: string): IterableIterator<Effect> {
  yield put(Projects.actions.FetchProject.request(id));

  const { response, error } = yield call(api.fetchProject, id);

  if (response) {
    yield call(storeIncludedEntities, response.included);
    yield put(Projects.actions.FetchProject.success(id, response.data));
  } else {
    yield put(Projects.actions.FetchProject.failure(id, error));
  }
}

function* fetchBranch(id: string, projectId: string): IterableIterator<Effect> {
  yield put(Branches.actions.FetchBranch.request(id, projectId));

  const { response, error } = yield call(api.fetchBranch, id);

  if (response) {
    yield call(storeIncludedEntities, response.included);
    yield put(Branches.actions.FetchBranch.success(id, response.data));
  } else {
    yield put(Branches.actions.FetchBranch.failure(id, error));
  }
}

function* fetchDeployment(id: string, projectId: string): IterableIterator<Effect> {
  yield put(Deployments.actions.FetchDeployment.request(id, projectId));

  const { response, error } = yield call(api.fetchDeployment, id);

  if (response) {
    yield call(storeIncludedEntities, response.included);
    yield put(Deployments.actions.FetchDeployment.success(id, response.data));
  } else {
    yield put(Deployments.actions.FetchDeployment.failure(id, error));
  }
}

// Loaders: Check if resource already exists. If not, fetch it.
function* loadProjects(): IterableIterator<Effect> {
  yield call(fetchProjects);
}

function* loadProject(id: string): IterableIterator<Effect> {
  const existingProject = yield select(Projects.selectors.getProject, id);

  if (!existingProject) {
    yield call(fetchProject, id);
  } else {
    console.log('Project already exists', existingProject);
  }
}

function* loadBranch(id: string, projectId: string): IterableIterator<Effect> {
  const existingBranch = yield select(Branches.selectors.getBranch, id);

  if (!existingBranch) {
    yield call(fetchBranch, id, projectId);
  } else {
    console.log('Branch already exists', existingBranch);
  }
}

function* loadDeployment(id: string, projectId: string): IterableIterator<Effect> {
  const existingDeployment = yield select(Deployments.selectors.getDeployment, id);

  if (!existingDeployment) {
    yield call(fetchDeployment, id, projectId);
  } else {
    console.log('Deployment already exists', existingDeployment);
  }
}

// Watchers: Watch for specific actions to begin async operations.
function* watchForLoadProjects(): IterableIterator<Effect> {
  while (true) {
    yield take(Projects.actions.LOAD_ALL_PROJECTS);

    yield fork(loadProjects);
  }
}

function* watchForLoadProject(): IterableIterator<Effect> {
  while (true) {
    const { id } = yield take(Projects.actions.LOAD_PROJECT);

    yield fork(loadProject, id);
  }
}

function* watchForLoadBranch(): IterableIterator<Effect> {
  while (true) {
    const { projectId, id } = yield take(Branches.actions.LOAD_BRANCH);

    yield fork(loadBranch, projectId, id);
  }
}

function* watchForLoadDeployment(): IterableIterator<Effect> {
  while (true) {
    const { projectId, id } = yield take(Deployments.actions.LOAD_DEPLOYMENT);

    yield fork(loadDeployment, projectId, id);
  }
}

export default function* root() {
  yield [
    fork(watchForLoadProjects),
    fork(watchForLoadProject),
    fork(watchForLoadBranch),
    fork(watchForLoadDeployment),
  ];
}
