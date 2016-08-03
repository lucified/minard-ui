import { compact } from 'lodash';
import { ActionCreator } from 'redux';
import { Effect, call, fork, put, select, take } from 'redux-saga/effects';

import Branches, { Branch } from '../modules/branches';
import Commits from '../modules/commits';
import Deployments, { Deployment } from '../modules/deployments';
import Projects, { Project } from '../modules/projects';

import { Api, ApiEntity } from '../api/types';

type EntityTypeString = "commits" | "projects" | "deployments" | "branches";

export default function createSagas(api: Api) {
  function* storeIncludedEntities(entities: ApiEntity[]): IterableIterator<Effect> {
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

  // Give an array of entities (of the same type) and a relationship selector
  // (e.g. 'deployments') along with the relationship's type to iterate over
  // all the given entities and make sure that all of the relationship entities
  // exist. If not, fetch them.
  function* fetchIfMissing(type: EntityTypeString, id: string): IterableIterator<Effect> {
    const selectors = {
      commits: Commits.selectors.getCommit,
      branches: Branches.selectors.getBranch,
      deployments: Deployments.selectors.getDeployment,
      projects: Projects.selectors.getProject,
    };
    const fetchers = {
      commits: fetchCommit,
      branches: fetchBranch,
      deployments: fetchDeployment,
      projects: fetchProject,
    };

    const existingEntity = yield select((<any> selectors)[type], id);
    if (!existingEntity) {
      yield call((<any> fetchers)[type], id);
    }
  }

  // Fetchers: Fetch the data from the server and store it into actions.
  // TODO: Don't fetch when already exists?
  function* fetchProjects(): IterableIterator<Effect | Effect[]> {
    yield put(Projects.actions.FetchProjects.request());

    const { response, error } = yield call(api.fetchProjects);

    if (response) {
      if (response.included) {
        yield call(storeIncludedEntities, response.included);
      }

      yield put(Projects.actions.FetchProjects.success(response.data));
      yield fork(ensureAllProjectsRelatedDataLoaded);
    } else {
      yield put(Projects.actions.FetchProjects.failure(error));
    }
  }

  function* ensureAllProjectsRelatedDataLoaded(): IterableIterator<Effect | Effect[]> {
    const projects = <Project[]> (yield select(Projects.selectors.getProjects));

    if (!projects) {
      throw new Error('No projects found!');
    }

    const deploymentIdsToCheck: string[] = [];

    for (let i = 0; i < projects.length; i++) {
      // Check all branches exist
      const { branches } = projects[i];
      yield branches.map(branchId => call(fetchIfMissing, 'branches', branchId));

      // Make sure latest deployment from each branch of each project is loaded
      for (let j = 0; j < branches.length; j++) {
        const branch = <Branch> (yield select(Branches.selectors.getBranch, branches[j]));
        deploymentIdsToCheck.push(branch.deployments[0]);
      }
    }

    yield compact(deploymentIdsToCheck).map(deploymentId => call(fetchIfMissing, 'deployments', deploymentId));
  }

  function* fetchProject(id: string): IterableIterator<Effect> {
    yield put(Projects.actions.FetchProject.request(id));

    const { response, error } = yield call(api.fetchProject, id);

    if (response) {
      if (response.included) {
        yield call(storeIncludedEntities, response.included);
      }

      yield put(Projects.actions.FetchProject.success(id, response.data));
      yield fork(ensureProjectRelatedDataLoaded, id);
    } else {
      yield put(Projects.actions.FetchProject.failure(id, error));
    }
  }

  function* ensureProjectRelatedDataLoaded(id: string): IterableIterator<Effect | Effect[]> {
    const project = <Project> (yield select(Projects.selectors.getProject, id));
    if (!project) {
      throw new Error('No project found!');
    }

    // Make sure all branches have been loaded
    const { branches } = project;
    yield branches.map(branchId => call(fetchIfMissing, 'branches', branchId));

    // Make sure all the deployments from each branch have been loaded
    let deploymentIdsToCheck: string[] = [];

    for (let i = 0; i < branches.length; i++) {
      const branch = <Branch> (yield select(Branches.selectors.getBranch, branches[i]));
      deploymentIdsToCheck = deploymentIdsToCheck.concat(branch.deployments);
    }

    yield compact(deploymentIdsToCheck).map(deploymentId => call(fetchIfMissing, 'deployments', deploymentId));
  }

  function* fetchBranch(id: string): IterableIterator<Effect> {
    yield put(Branches.actions.FetchBranch.request(id));

    const { response, error } = yield call(api.fetchBranch, id);

    if (response) {
      if (response.included) {
        yield call(storeIncludedEntities, response.included);
      }

      yield put(Branches.actions.FetchBranch.success(id, response.data));
      yield fork(ensureBranchRelatedDataLoaded, id);
    } else {
      yield put(Branches.actions.FetchBranch.failure(id, error));
    }
  }

  function* ensureBranchRelatedDataLoaded(id: string): IterableIterator<Effect | Effect[]> {
    const branch = <Branch> (yield select(Branches.selectors.getBranch, id));

    yield branch.deployments.map(deploymentId => call(fetchIfMissing, 'deployments', deploymentId));
    yield branch.commits.map(commitId => call(fetchIfMissing, 'commits', commitId));
  }

  function* fetchDeployment(id: string): IterableIterator<Effect> {
    yield put(Deployments.actions.FetchDeployment.request(id));

    const { response, error } = yield call(api.fetchDeployment, id);

    if (response) {
      if (response.included) {
        yield call(storeIncludedEntities, response.included);
      }

      yield put(Deployments.actions.FetchDeployment.success(id, response.data));
      yield fork(ensureDeploymentRelatedDataLoaded, id);
    } else {
      yield put(Deployments.actions.FetchDeployment.failure(id, error));
    }
  }

  function* ensureDeploymentRelatedDataLoaded(id: string): IterableIterator<Effect | Effect[]> {
    const deployment = <Deployment> (yield select(Deployments.selectors.getDeployment, id));

    yield call(fetchIfMissing, 'commits', deployment.commit);
  }

  function* fetchCommit(_: string): IterableIterator<Effect> {
    throw new Error('fetchCommit: Not implemented');
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
      const { id } = yield take(Branches.actions.LOAD_BRANCH);

      yield fork(fetchBranch, id);
    }
  }

  function* watchForLoadDeployment(): IterableIterator<Effect> {
    while (true) {
      const { id } = yield take(Deployments.actions.LOAD_DEPLOYMENT);

      yield fork(fetchDeployment, id);
    }
  }

  function* root() {
    yield [
      fork(watchForLoadProjects),
      fork(watchForLoadProject),
      fork(watchForLoadBranch),
      fork(watchForLoadDeployment),
    ];
  }

  return {
    root,
    watchForLoadDeployment,
    watchForLoadBranch,
    watchForLoadProject,
    watchForLoadProjects,
    fetchBranch,
    fetchDeployment,
    fetchProject,
    fetchProjects,
    storeIncludedEntities,
  };
}
