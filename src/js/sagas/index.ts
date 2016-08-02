import { ActionCreator } from 'redux';
import { Effect, call, fork, put, select, take } from 'redux-saga/effects';

import * as api from '../api';

import Branches, { Branch } from '../modules/branches';
import Commits from '../modules/commits';
import Deployments from '../modules/deployments';
import Projects, { Project } from '../modules/projects';

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
// TODO: Don't fetch when already exists?
function* fetchProjects(): IterableIterator<Effect> {
  yield put(Projects.actions.FetchProjects.request());

  const { response, error } = yield call(api.fetchProjects);

  if (response) {
    if (response.included) {
      yield call(storeIncludedEntities, response.included);
    }
    yield put(Projects.actions.FetchProjects.success(response.data));

    // Make sure the latest deployment from each branch of each project is loaded
    const projects = <Project[]>(yield select(Projects.selectors.getProjects));
    if (projects) {
      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const { branches } = project;

        for (let j = 0; j < branches.length; j++) {
          const branch = <Branch>(yield select(Branches.selectors.getBranch, branches[j]));
          const deploymentId = branch.deployments[0];
          if (deploymentId) {
            const deployment = yield select(Deployments.selectors.getDeployment, deploymentId);
            if (!deployment) {
              yield call(fetchDeployment, deploymentId, project.id);
            }
          }
        }
      }
    } else {
      throw new Error('No projects found!');
    }
  } else {
    yield put(Projects.actions.FetchProjects.failure(error));
  }
}

function* fetchProject(id: string): IterableIterator<Effect> {
  yield put(Projects.actions.FetchProject.request(id));

  const { response, error } = yield call(api.fetchProject, id);

  if (response) {
    if (response.included) {
      yield call(storeIncludedEntities, response.included);
    }

    yield put(Projects.actions.FetchProject.success(id, response.data));

    // Load the deployments from each branch
    const { branches } = yield select(Projects.selectors.getProject, id);

    for (let i = 0; i < branches.length; i++) {
      const branch = <Branch>(yield select(Branches.selectors.getBranch, branches[i]));

      for (let j = 0; j < branch.deployments.length; j++) {
        const deploymentId = branch.deployments[j];
        const deployment = yield select(Deployments.selectors.getDeployment, deploymentId);
        if (!deployment) {
          yield call(fetchDeployment, deploymentId, id);
        }
      }
    }
  } else {
    yield put(Projects.actions.FetchProject.failure(id, error));
  }
}

function* fetchBranch(id: string, projectId: string): IterableIterator<Effect> {
  yield put(Branches.actions.FetchBranch.request(id, projectId));

  const { response, error } = yield call(api.fetchBranch, id);

  if (response) {
    if (response.included) {
      yield call(storeIncludedEntities, response.included);
    }

    yield put(Branches.actions.FetchBranch.success(id, projectId, response.data));
  } else {
    yield put(Branches.actions.FetchBranch.failure(id, projectId, error));
  }
}

function* fetchDeployment(id: string, projectId: string): IterableIterator<Effect> {
  yield put(Deployments.actions.FetchDeployment.request(id, projectId));

  const { response, error } = yield call(api.fetchDeployment, id);

  if (response) {
    if (response.included) {
      yield call(storeIncludedEntities, response.included);
    }

    yield put(Deployments.actions.FetchDeployment.success(id, projectId, response.data));
  } else {
    yield put(Deployments.actions.FetchDeployment.failure(id, projectId, error));
  }
}

// Watchers: Watch for specific actions to begin async operations.
function* watchForLoadProjects(): IterableIterator<Effect> {
  while (true) {
    yield take(Projects.actions.LOAD_ALL_PROJECTS);

    yield fork(fetchProjects);
  }
}

function* watchForLoadProject(): IterableIterator<Effect> {
  while (true) {
    const { id } = yield take(Projects.actions.LOAD_PROJECT);

    yield fork(fetchProject, id);
  }
}

function* watchForLoadBranch(): IterableIterator<Effect> {
  while (true) {
    const { id, projectId } = yield take(Branches.actions.LOAD_BRANCH);

    yield fork(fetchBranch, id, projectId);
  }
}

function* watchForLoadDeployment(): IterableIterator<Effect> {
  while (true) {
    const { id, projectId } = yield take(Deployments.actions.LOAD_DEPLOYMENT);

    yield fork(fetchDeployment, id, projectId);
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
