import { compact } from 'lodash';
import { Effect, call, fork, put, select, take } from 'redux-saga/effects';

import { Api, ApiEntityTypeString } from '../api/types';
import Branches, { Branch } from '../modules/branches';
import Commits, { Commit } from '../modules/commits';
import Deployments, { Deployment } from '../modules/deployments';
import Projects, { Project } from '../modules/projects';

// Loaders check whether an entity exists. If not, fetch it with a fetcher.
// Afterwards, the loader also ensures that other needed data exists.
import { createFetcher, createLoader, storeIncludedEntities } from './utils';

export default function createSagas(api: Api) {

  // Returns the entity object
  function* fetchIfMissing(type: ApiEntityTypeString, id: string): IterableIterator<Effect> {
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

    const selector = (<any> selectors)[type];
    const fetcher = (<any> fetchers)[type];

    let existingEntity = yield select(selector, id);

    if (!existingEntity) {
      yield call(fetcher, id);
      existingEntity = yield select(selector, id);
    }

    return existingEntity;
  }

  // ALL PROJECTS
  function* fetchAllProjects(): IterableIterator<Effect> {
    yield put(Projects.actions.FetchAllProjects.request());

    const { response, error } = yield call(api.fetchAllProjects);

    if (response) {
      if (response.included) {
        yield call(storeIncludedEntities, response.included);
      }

      yield put(Projects.actions.FetchAllProjects.success(response.data));
      yield fork(ensureAllProjectsRelatedDataLoaded);
    } else {
      yield put(Projects.actions.FetchAllProjects.failure(error));
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
      const { branches: branchIds } = projects[i];
      const branches = yield branchIds.map(branchId => call(fetchIfMissing, 'branches', branchId));

      // Make sure latest deployment from each branch of each project is loaded
      for (let j = 0; j < branches.length; j++) {
        const branch = <Branch> branches[j];
        deploymentIdsToCheck.push(branch.deployments[0]);
      }
    }

    yield compact(deploymentIdsToCheck).map(deploymentId => call(fetchIfMissing, 'deployments', deploymentId));
  }

  // PROJECT
  const fetchProject = createFetcher(Projects.actions.FetchProject, api.fetchProject);
  const loadProject = createLoader(Projects.selectors.getProject, fetchProject, ensureProjectRelatedDataLoaded);

  function* ensureProjectRelatedDataLoaded(id: string): IterableIterator<Effect | Effect[]> {
    const project = <Project> (yield select(Projects.selectors.getProject, id));
    if (!project) {
      throw new Error('No project found!');
    }

    // Make sure all branches have been loaded
    const { branches: branchIds } = project;
    const branches = yield branchIds.map(branchId => call(fetchIfMissing, 'branches', branchId));

    // Make sure all the deployments from each branch have been loaded
    let deploymentIdsToCheck: string[] = [];

    for (let i = 0; i < branches.length; i++) {
      const branch = <Branch> branches[i];
      deploymentIdsToCheck = deploymentIdsToCheck.concat(branch.deployments);
    }

    yield compact(deploymentIdsToCheck).map(deploymentId => call(fetchIfMissing, 'deployments', deploymentId));
  }

  // BRANCH
  const fetchBranch = createFetcher(Branches.actions.FetchBranch, api.fetchBranch);
  const loadBranch = createLoader(Branches.selectors.getBranch, fetchBranch, ensureBranchRelatedDataLoaded);

  function* ensureBranchRelatedDataLoaded(id: string): IterableIterator<Effect | Effect[]> {
    const branch = <Branch> (yield select(Branches.selectors.getBranch, id));

    yield branch.deployments.map(deploymentId => call(fetchIfMissing, 'deployments', deploymentId));
    yield branch.commits.map(commitId => call(fetchIfMissing, 'commits', commitId));
  }

  // DEPLOYMENT
  const fetchDeployment = createFetcher(Deployments.actions.FetchDeployment, api.fetchDeployment);
  const loadDeployment =
    createLoader(Deployments.selectors.getDeployment, fetchDeployment, ensureDeploymentRelatedDataLoaded);

  function* ensureDeploymentRelatedDataLoaded(id: string): IterableIterator<Effect> {
    const deployment = <Deployment> (yield select(Deployments.selectors.getDeployment, id));

    yield call(fetchIfMissing, 'commits', deployment.commit);
  }

  // COMMIT
  const fetchCommit = createFetcher(Commits.actions.FetchCommit, api.fetchCommit);
  const loadCommit =
    createLoader(Commits.selectors.getCommit, fetchCommit, ensureCommitRelatedDataLoaded);

  function* ensureCommitRelatedDataLoaded(id: string): IterableIterator<Effect> {
    const commit = <Commit> (yield select(Commits.selectors.getCommit, id));

    if (commit.deployment) {
      yield call(fetchIfMissing, 'deployments', commit.deployment);
    }
  }

  // WATCHERS: Watch for specific actions to begin async operations.
  function* watchForLoadAllProjects(): IterableIterator<Effect> {
    while (true) {
      yield take(Projects.actions.LOAD_ALL_PROJECTS);

      yield fork(fetchAllProjects);
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
      const { id } = yield take(Branches.actions.LOAD_BRANCH);

      yield fork(loadBranch, id);
    }
  }

  function* watchForLoadDeployment(): IterableIterator<Effect> {
    while (true) {
      const { id } = yield take(Deployments.actions.LOAD_DEPLOYMENT);

      yield fork(loadDeployment, id);
    }
  }

  function* watchForLoadCommit(): IterableIterator<Effect> {
    while (true) {
      const { id } = yield take(Commits.actions.LOAD_COMMIT);

      yield fork(loadCommit, id);
    }
  }

  function* root() {
    yield [
      fork(watchForLoadAllProjects),
      fork(watchForLoadProject),
      fork(watchForLoadBranch),
      fork(watchForLoadDeployment),
      fork(watchForLoadCommit),
    ];
  }

  return {
    root,
    watchForLoadDeployment,
    watchForLoadBranch,
    watchForLoadProject,
    watchForLoadAllProjects,
    watchForLoadCommit,
    fetchBranch,
    fetchDeployment,
    fetchProject,
    fetchAllProjects,
    fetchCommit,
    loadBranch,
    loadDeployment,
    loadProject,
    loadCommit,
    ensureAllProjectsRelatedDataLoaded,
    ensureBranchRelatedDataLoaded,
    ensureDeploymentRelatedDataLoaded,
    ensureCommitRelatedDataLoaded,
    ensureProjectRelatedDataLoaded,
    fetchIfMissing,
    storeIncludedEntities,
  };
}
