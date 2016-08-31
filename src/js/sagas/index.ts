import { compact, uniq } from 'lodash';
import { takeEvery } from 'redux-saga';
import { Effect, call, fork, put, race, select, take } from 'redux-saga/effects';

import { Api, ApiEntityTypeString } from '../api/types';
import Activities, { Activity } from '../modules/activities';
import Branches, { Branch } from '../modules/branches';
import Commits, { Commit } from '../modules/commits';
import Deployments, { Deployment } from '../modules/deployments';
import Projects, { Project } from '../modules/projects';

// Loaders check whether an entity exists. If not, fetch it with a fetcher.
// Afterwards, the loader also ensures that other needed data exists.
import { createFetcher, createLoader, storeIncludedEntities, FORM_SUBMIT } from './utils';

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

  // ALL ACTIVITIES
  function* loadActivities(): IterableIterator<Effect> {
    const fetchSuccess = yield call(fetchActivities);
    if (fetchSuccess) {
      yield fork(ensureActivitiesRelatedDataLoaded);
    }
  }

  function* fetchActivities(): IterableIterator<Effect> {
    yield put(Activities.actions.FetchActivities.request());

    const { response, error } = yield call(api.fetchActivities);

    if (response) {
      if (response.included) {
        yield call(storeIncludedEntities, response.included);
      }

      yield put(Activities.actions.FetchActivities.success(response.data));

      return true;
    } else {
      yield put(Activities.actions.FetchActivities.failure(error));

      return false;
    }
  }

  function* ensureActivitiesRelatedDataLoaded(): IterableIterator<Effect | Effect[]> {
    const activities = <Activity[]> (yield select(Activities.selectors.getActivities));
    const deployments =
      <Deployment[]> (yield activities.map(activity => call(fetchIfMissing, 'deployments', activity.deployment)));
    // TODO: check activity type and fetch e.g. comments
    yield deployments.map(deployment => call(fetchIfMissing, 'commits', deployment.commit));
    yield uniq(activities.map(activity => activity.project)).map(project => call(fetchIfMissing, 'projects', project));
    yield uniq(activities.map(activity => activity.branch)).map(branch => call(fetchIfMissing, 'branches', branch));
  }

  // PROJECT ACTIVITIES
  function* loadActivitiesForProject(id: string): IterableIterator<Effect> {
    const fetchSuccess = yield call(fetchActivitiesForProject, id);
    if (fetchSuccess) {
      yield fork(ensureActivitiesRelatedDataLoaded);
    }
  }

  function* fetchActivitiesForProject(id: string): IterableIterator<Effect> {
    yield put(Activities.actions.FetchActivitiesForProject.request(id));

    const { response, error } = yield call(api.fetchActivitiesForProject, id);

    if (response) {
      if (response.included) {
        yield call(storeIncludedEntities, response.included);
      }

      yield put(Activities.actions.FetchActivitiesForProject.success(id, response.data));

      return true;
    } else {
      yield put(Activities.actions.FetchActivitiesForProject.failure(id, error));

      return false;
    }
  }

  // ALL PROJECTS
  function* loadAllProjects(): IterableIterator<Effect> {
    const fetchSuccess = yield call(fetchAllProjects);
    if (fetchSuccess) {
      yield fork(ensureAllProjectsRelatedDataLoaded);
    }
  }

  function* fetchAllProjects(): IterableIterator<Effect> {
    yield put(Projects.actions.FetchAllProjects.request());

    const { response, error } = yield call(api.fetchAllProjects);

    if (response) {
      if (response.included) {
        yield call(storeIncludedEntities, response.included);
      }

      yield put(Projects.actions.FetchAllProjects.success(response.data));

      return true;
    } else {
      yield put(Projects.actions.FetchAllProjects.failure(error));

      return false;
    }
  }

  function* ensureAllProjectsRelatedDataLoaded(): IterableIterator<Effect | Effect[]> {
    const projects = <Project[]> (yield select(Projects.selectors.getProjects));

    if (!projects) {
      throw new Error('No projects found!');
    }

    for (let i = 0; i < projects.length; i++) {
      yield call(ensureProjectRelatedDataLoaded, projects[i]);
    }
  }

  // PROJECT
  const fetchProject = createFetcher(Projects.actions.FetchProject, api.fetchProject);
  const loadProject = createLoader(Projects.selectors.getProject, fetchProject, ensureProjectRelatedDataLoaded);

  function* ensureProjectRelatedDataLoaded(projectOrId: Project | string): IterableIterator<Effect | Effect[]> {
    let project: Project;

    if (typeof projectOrId === 'string') {
      project = <Project> (yield select(Projects.selectors.getProject, projectOrId));
    } else {
      project = projectOrId;
    }

    if (!project) {
      throw new Error('No project found!');
    }

    // Make sure all branches have been loaded
    const { branches: branchIds } = project;
    const branches = yield branchIds.map(branchId => call(fetchIfMissing, 'branches', branchId));

    // Make sure the latest deployment from each branch has been loaded
    let deploymentIdsToCheck: string[] = [];

    for (let i = 0; i < branches.length; i++) {
      const branch = <Branch> branches[i];
      deploymentIdsToCheck.push(branch.deployments[0]);
    }

    yield compact(deploymentIdsToCheck).map(deploymentId => call(fetchIfMissing, 'deployments', deploymentId));
  }

  // BRANCH
  const fetchBranch = createFetcher(Branches.actions.FetchBranch, api.fetchBranch);
  const loadBranch = createLoader(Branches.selectors.getBranch, fetchBranch, ensureBranchRelatedDataLoaded);

  function* ensureBranchRelatedDataLoaded(id: string): IterableIterator<Effect | Effect[]> {
    const branch = <Branch> (yield select(Branches.selectors.getBranch, id));

    yield call(fetchIfMissing, 'projects', branch.project);
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

  interface Payload {
    submitAction: string;
    successAction: string;
    failureAction: string;
    values: any;
    resolve: () => void;
    reject: (error: any) => void;
  }

  function* formSubmitSaga({
    payload: {
      submitAction,
      successAction,
      failureAction,
      values,
      resolve,
      reject,
    },
  }: { payload: Payload }): IterableIterator<Effect> {
    yield put({ type: submitAction, payload: values });

    const { success, failure } = yield race({
      success: take(successAction),
      failure: take(failureAction),
    });

    // Resolve and reject tell the redux-form that submitting is done and if it was successful or not
    if (success) {
      yield call(resolve);
    } else {
      yield call(reject, failure.payload);
    }
  }

  // WATCHERS: Watch for specific actions to begin async operations.
  function* watchForFormSubmit() {
    yield* takeEvery(FORM_SUBMIT, formSubmitSaga);
  }

  function* watchForLoadActivities() {
    yield* takeEvery(Activities.actions.LOAD_ACTIVITIES, loadActivities);
  }

  function* watchForLoadActivitiesForProject() {
    yield* takeEvery(Activities.actions.LOAD_ACTIVITIES_FOR_PROJECT, loadActivitiesForProject);
  }

  function* watchForLoadAllProjects() {
    yield* takeEvery(Projects.actions.LOAD_ALL_PROJECTS, loadAllProjects);
  }

  function* watchForLoadProject() {
    yield* takeEvery(Projects.actions.LOAD_PROJECT, loadProject);
  }

  function* watchForLoadBranch() {
    yield* takeEvery(Branches.actions.LOAD_BRANCH, loadBranch);
  }

  function* watchForLoadDeployment() {
    yield* takeEvery(Deployments.actions.LOAD_DEPLOYMENT, loadDeployment);
  }

  function* watchForLoadCommit() {
    yield* takeEvery(Commits.actions.LOAD_COMMIT, loadCommit);
  }

  function* root() {
    yield [
      fork(watchForLoadAllProjects),
      fork(watchForLoadProject),
      fork(watchForLoadBranch),
      fork(watchForLoadDeployment),
      fork(watchForLoadCommit),
      fork(watchForLoadActivities),
      fork(watchForLoadActivitiesForProject),
      fork(watchForFormSubmit),
    ];
  }

  return {
    root,
    watchForLoadDeployment,
    watchForLoadBranch,
    watchForLoadProject,
    watchForLoadAllProjects,
    watchForLoadCommit,
    watchForLoadActivities,
    watchForLoadActivitiesForProject,
    watchForFormSubmit,
    formSubmitSaga,
    fetchActivities,
    fetchActivitiesForProject,
    fetchBranch,
    fetchDeployment,
    fetchProject,
    fetchAllProjects,
    fetchCommit,
    loadActivities,
    loadActivitiesForProject,
    loadAllProjects,
    loadBranch,
    loadDeployment,
    loadProject,
    loadCommit,
    ensureActivitiesRelatedDataLoaded,
    ensureAllProjectsRelatedDataLoaded,
    ensureBranchRelatedDataLoaded,
    ensureDeploymentRelatedDataLoaded,
    ensureCommitRelatedDataLoaded,
    ensureProjectRelatedDataLoaded,
    fetchIfMissing,
    storeIncludedEntities,
  };
}
