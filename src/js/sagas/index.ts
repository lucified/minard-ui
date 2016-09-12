import { compact, uniq } from 'lodash';
import { SubmissionError } from 'redux-form';
import { takeEvery, takeLatest } from 'redux-saga';
import { Effect, call, fork, put, race, select, take } from 'redux-saga/effects';

import * as Converter from '../api/convert';
import { Api, ApiEntity, ApiEntityTypeString, ApiResponse } from '../api/types';
import Activities, { Activity, LoadActivitiesForProjectAction, LoadActivitiesAction } from '../modules/activities';
import Branches, { Branch, LoadBranchesForProjectAction, StoreBranchesAction } from '../modules/branches';
import Commits, { Commit, LoadCommitsForBranchAction } from '../modules/commits';
import Deployments, { Deployment } from '../modules/deployments';
import { isFetchError, FetchError } from '../modules/errors';
import { onSubmitActions, FORM_SUBMIT } from '../modules/forms';
import Projects, { Project, DeleteProjectAction, StoreProjectsAction } from '../modules/projects';
import Requests from '../modules/requests';

// Loaders check whether an entity exists. If not, fetch it with a fetcher.
// Afterwards, the loader also ensures that other needed data exists.
import { createCollectionFetcher, createEntityFetcher, createLoader, storeIncludedEntities } from './utils';

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

    if (!existingEntity || isFetchError(existingEntity)) {
      yield call(fetcher, id);
      existingEntity = yield select(selector, id);
    }

    return existingEntity;
  }

  // ALL ACTIVITIES
  function* loadActivities(action: LoadActivitiesAction): IterableIterator<Effect> {
    const { count, until } = action;
    const fetchSuccess = yield call(fetchActivities, count, until);
    if (fetchSuccess) {
      yield fork(ensureActivitiesRelatedDataLoaded);
    }
  }

  const fetchActivities = createCollectionFetcher(
    Requests.actions.Activities.LoadAllActivities,
    Converter.toActivities,
    Activities.actions.storeActivities,
    api.Activity.fetchAll,
    checkIfAllActivitiesLoaded,
  );

  function* checkIfAllActivitiesLoaded(response: ApiResponse, count: number, until?: number): IterableIterator<Effect> {
    if ((<ApiEntity[]> response.data).length < count) {
      yield put(Requests.actions.allActivitiesRequested());
    }
  }

  function* ensureActivitiesRelatedDataLoaded(): IterableIterator<Effect | Effect[]> {
    // Do nothing. Activities are self-contained
  }

  // PROJECT ACTIVITIES
  function* loadActivitiesForProject(action: LoadActivitiesForProjectAction): IterableIterator<Effect> {
    const { id, count, until } = action;
    const fetchSuccess = yield call(fetchActivitiesForProject, id, count, until);
    if (fetchSuccess) {
      yield fork(ensureActivitiesRelatedDataLoaded);
    }
  }

  const fetchActivitiesForProject = createEntityFetcher(
    Requests.actions.Activities.LoadActivitiesForProject,
    Converter.toActivities,
    Activities.actions.storeActivities,
    api.Activity.fetchAllForProject,
    checkIfAllActivitiesLoadedForProject,
  );

  function* checkIfAllActivitiesLoadedForProject(id: string, response: ApiResponse, count: number, until?: number): IterableIterator<Effect> {
    if ((<ApiEntity[]> response.data).length < count) {
      yield put(Requests.actions.allActivitiesRequestedForProject(id));
    }
  }

  // ALL PROJECTS
  function* loadAllProjects(): IterableIterator<Effect> {
    const fetchSuccess = yield call(fetchAllProjects);
    if (fetchSuccess) {
      yield fork(ensureAllProjectsRelatedDataLoaded);
    }
  }

  const fetchAllProjects = createCollectionFetcher(
    Requests.actions.Projects.LoadAllProjects,
    Converter.toProjects,
    Projects.actions.storeProjects,
    api.Project.fetchAll
  );

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
  const fetchProject = createEntityFetcher(
    Requests.actions.Projects.LoadProject,
    Converter.toProjects,
    Projects.actions.storeProjects,
    api.Project.fetch
  );
  const loadProject = createLoader(Projects.selectors.getProject, fetchProject, ensureProjectRelatedDataLoaded);

  function* ensureProjectRelatedDataLoaded(projectOrId: Project | string): IterableIterator<Effect | Effect[]> {
    let project: Project | FetchError | undefined;

    if (typeof projectOrId === 'string') {
      project = <Project | FetchError | undefined> (yield select(Projects.selectors.getProject, projectOrId));
    } else {
      project = projectOrId;
    }

    if (!project) {
      throw new Error('No project found!');
    }

    if (isFetchError(project)) {
      throw new Error('Unable to fetch project!');
    }

    if (project.latestSuccessfullyDeployedCommit) {
      const commit = <Commit | FetchError | undefined> (yield call(fetchIfMissing, 'commits', project.latestSuccessfullyDeployedCommit));
      if (commit && !isFetchError(commit) && commit.deployment) {
        yield call(fetchIfMissing, 'deployments', commit.deployment);
      }
    }
  }

  // BRANCH
  const fetchBranch = createEntityFetcher(
    Requests.actions.Branches.LoadBranch,
    Converter.toBranches,
    Branches.actions.storeBranches,
    api.Branch.fetch
  );
  const loadBranch = createLoader(Branches.selectors.getBranch, fetchBranch, ensureBranchRelatedDataLoaded);

  function* ensureBranchRelatedDataLoaded(id: string): IterableIterator<Effect | Effect[]> {
    const branch = <Branch | FetchError | undefined> (yield select(Branches.selectors.getBranch, id));

    if (branch && !isFetchError(branch)) {
      yield call(fetchIfMissing, 'projects', branch.project);
      if (branch.latestSuccessfullyDeployedCommit) {
        const commit = <Commit | FetchError | undefined>
          (yield call(fetchIfMissing, 'commits', branch.latestSuccessfullyDeployedCommit));
        if (commit && !isFetchError(commit) && commit.deployment) {
          yield call(fetchIfMissing, 'deployments', commit.deployment);
        }
      }
      if (branch.latestCommit) {
        yield call(fetchIfMissing, 'commits', branch.latestCommit);
      }
    }
  }

  // BRANCHES_FOR_PROJECT
  function* loadBranchesForProject(action: LoadBranchesForProjectAction): IterableIterator<Effect> {
    const id = action.id;
    let project = <Project | FetchError | undefined>(yield select(Projects.selectors.getProject, id));

    while (!project) {
      const { entities: projects } = <StoreProjectsAction>(yield take(Projects.actions.STORE_PROJECTS));
      project = projects.find(project => project.id === id);
    }

    if (isFetchError(project)) {
      console.log('Error: Not fetching branches for project.');
    } else {
      const fetchSuccess = yield call(fetchBranchesForProject, id);
      if (fetchSuccess) {
        yield fork(ensureBranchesForProjectRelatedDataLoaded, id);
      }
    }
  }

  const fetchBranchesForProject = createEntityFetcher(
    Requests.actions.Branches.LoadBranchesForProject,
    Converter.toBranches,
    Branches.actions.storeBranches,
    api.Branch.fetchForProject,
    addBranchesToProject,
  );

  function* addBranchesToProject(id: string, response: ApiResponse): IterableIterator<Effect> {
    const branchIds = (<ApiEntity[]> response.data).map((branch: any) => branch.id);
    yield put(Projects.actions.addBranchesToProject(id, branchIds));
  }

  function* ensureBranchesForProjectRelatedDataLoaded(id: string): IterableIterator<Effect | Effect[]> {
    const branches = <Branch[]> (yield select(Branches.selectors.getBranchesForProject, id));

    // Ensure latest deployed commits and deployments exist
    const deployedCommits =
      <Commit[]> (yield compact(branches.map(branch => branch.latestSuccessfullyDeployedCommit))
        .map(commitId => call(fetchIfMissing, 'commits', commitId)));
    yield deployedCommits.map(commit => call(fetchIfMissing, 'deployments', commit.deployment));

    // Ensure latest commits exist
    yield compact(branches.map(branch => branch.latestCommit))
      .map(commitId => call(fetchIfMissing, 'commits', commitId));
  }

  // DEPLOYMENT
  const fetchDeployment = createEntityFetcher(
    Requests.actions.Deployments.LoadDeployment,
    Converter.toDeployments,
    Deployments.actions.storeDeployments,
    api.Deployment.fetch
  );
  const loadDeployment =
    createLoader(Deployments.selectors.getDeployment, fetchDeployment, ensureDeploymentRelatedDataLoaded);

  function* ensureDeploymentRelatedDataLoaded(id: string): IterableIterator<Effect> {
    // Nothing to do
  }

  // COMMIT
  const fetchCommit = createEntityFetcher(
    Requests.actions.Commits.LoadCommit,
    Converter.toCommits,
    Commits.actions.storeCommits,
    api.Commit.fetch
  );
  const loadCommit =
    createLoader(Commits.selectors.getCommit, fetchCommit, ensureCommitRelatedDataLoaded);

  function* ensureCommitRelatedDataLoaded(id: string): IterableIterator<Effect> {
    const commit = <Commit | undefined | FetchError> (yield select(Commits.selectors.getCommit, id));

    if (commit && !isFetchError(commit) && commit.deployment) {
      yield call(fetchIfMissing, 'deployments', commit.deployment);
    }
  }

  // COMMITS_FOR_BRANCH
  function* loadCommitsForBranch(action: LoadCommitsForBranchAction): IterableIterator<Effect> {
    const { id, count, until } = action;
    let branch = <Branch | FetchError | undefined>(yield select(Branches.selectors.getBranch, id));

    while (!branch) {
      const { entities: branches } = <StoreBranchesAction>(yield take(Branches.actions.STORE_BRANCHES));
      branch = branches.find(branch => branch.id === id);
    }

    if (isFetchError(branch)) {
      console.log('Error: Not fetching commits for branch.');
    } else {
      const fetchSuccess = yield call(fetchCommitsForBranch, id, count, until);
      if (fetchSuccess) {
        yield fork(ensureCommitsForBranchRelatedDataLoaded, id);
      }
    }
  }

  const fetchCommitsForBranch = createEntityFetcher(
    Requests.actions.Commits.LoadCommitsForBranch,
    Converter.toCommits,
    Commits.actions.storeCommits,
    api.Commit.fetchForBranch,
    addCommitsToBranch,
  );

  function* addCommitsToBranch(id: string, response: ApiResponse, count: number, until?: number): IterableIterator<Effect> {
    const commitIds = (<ApiEntity[]> response.data).map((commit: any) => commit.id);
    yield put(Branches.actions.addCommitsToBranch(id, commitIds, count));
  }

  function* ensureCommitsForBranchRelatedDataLoaded(id: string): IterableIterator<Effect | Effect[]> {
    const branch = <Branch | undefined | FetchError> (yield select(Branches.selectors.getBranch, id));
    if (branch && !isFetchError(branch)) {
      const commits = <Commit[]> (yield branch.commits.map(id => call(fetchIfMissing, 'commits', id)));
      yield compact(commits.map(commit => commit.deployment))
        .map(deploymentId => call(fetchIfMissing, 'deployments', deploymentId));
    }
  }

  // CREATE PROJECT
  function* createProject(action: { type: string, payload: any }): IterableIterator<Effect> {
    const { name, description } = action.payload;

    yield put(Requests.actions.Projects.CreateProject.REQUEST.actionCreator(name));

    const { response, error, details }: { response?: any, error?: string, details?: string } =
      yield call(api.Project.create, name, description);

    if (response) {
      if (response.included) {
        yield call(storeIncludedEntities, response.included);
      }

      // Notify form that creation was a success
      yield put(Requests.actions.Projects.CreateProject.SUCCESS.actionCreator(name));

      // Store new project
      const projectObject = yield call(Converter.toProjects, response.data);
      yield put(Projects.actions.storeProjects(projectObject));

      return true;
    } else {
      // Notify form that creation failed
      yield put(Requests.actions.Projects.CreateProject.FAILURE.actionCreator(name, error!, details));

      return false;
    }
  }

  // Delete PROJECT
  function* deleteProject(action: DeleteProjectAction): IterableIterator<Effect> {
    const { id, resolve, reject } = action;

    yield put(Requests.actions.Projects.DeleteProject.REQUEST.actionCreator(id));

    const { response, error, details } = yield call(api.Project.delete, id);

    if (response) {
      yield put(Requests.actions.Projects.DeleteProject.SUCCESS.actionCreator(id));
      yield call(resolve);

      return true;
    } else {
      yield put(Requests.actions.Projects.DeleteProject.FAILURE.actionCreator(id, error, details));
      yield call(reject);

      return false;
    }
  }

  // Edit PROJECT
  function* editProject(action: { type: string, payload: any }): IterableIterator<Effect> {
    const { id, name } = action.payload;
    // If we don't force description to exist, there would be no way to clear it when editing
    const description = action.payload.description || '';

    yield put(Requests.actions.Projects.EditProject.REQUEST.actionCreator(id));

    const { response, error, details } = yield call(api.Project.edit, id, { name, description });

    if (response) {
      // Notify form that creation was a success
      yield put(Requests.actions.Projects.EditProject.SUCCESS.actionCreator(id));

      // Store edited project
      const projectObject = yield call(Converter.toProjects, response.data);
      yield put(Projects.actions.storeProjects(projectObject));

      return true;
    } else {
      // Notify form that creation failed
      yield put(Requests.actions.Projects.EditProject.FAILURE.actionCreator(id, error, details));

      return false;
    }
  }

  // FORMS
  interface FormSubmitPayload {
    submitAction: string;
    successAction: string;
    failureAction: string;
    values: any;
    resolve: (id: string) => void;
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
  }: { payload: FormSubmitPayload }): IterableIterator<Effect> {
    yield put({ type: submitAction, payload: values });

    const { success, failure } = yield race({
      success: take(successAction),
      failure: take(failureAction),
    });
    // success is the action generated by the .success() action creator and failure by .failure

    // Resolve and reject tell the redux-form that submitting is done and if it was successful or not
    if (success) {
      yield call(resolve, success.id);
    } else { // _error indicates that it's a form-wide ("global") error
      yield call(reject, new SubmissionError({ _error: failure.prettyError }));
    }
  }

  // WATCHERS: Watch for specific actions to begin async operations.
  function* watchForFormSubmit() {
    yield* takeEvery(FORM_SUBMIT, formSubmitSaga);
  }

  function* watchForCreateProject() {
    yield* takeLatest(Projects.actions.CREATE_PROJECT, createProject);
  }

  function* watchForDeleteProject() {
    yield* takeLatest(Projects.actions.DELETE_PROJECT, deleteProject);
  }

  function* watchForEditProject() {
    yield* takeLatest(Projects.actions.EDIT_PROJECT, editProject);
  }

  function* watchForLoadActivities(): IterableIterator<Effect> {
    while (true) {
      const action = yield take(Activities.actions.LOAD_ACTIVITIES);
      yield call(loadActivities);
    }
  }

  function* watchForLoadActivitiesForProject() {
    yield* takeEvery(Activities.actions.LOAD_ACTIVITIES_FOR_PROJECT, loadActivitiesForProject);
  }

  function* watchForLoadAllProjects(): IterableIterator<Effect> {
    while (true) {
      const action = yield take(Projects.actions.LOAD_ALL_PROJECTS);
      yield call(loadAllProjects);
    }
  }

  function* watchForLoadProject() {
    yield* takeEvery(Projects.actions.LOAD_PROJECT, loadProject);
  }

  function* watchForLoadBranch() {
    yield* takeEvery(Branches.actions.LOAD_BRANCH, loadBranch);
  }

  function* watchForLoadBranchesForProject() {
    yield* takeEvery(Branches.actions.LOAD_BRANCHES_FOR_PROJECT, loadBranchesForProject);
  }

  function* watchForLoadDeployment() {
    yield* takeEvery(Deployments.actions.LOAD_DEPLOYMENT, loadDeployment);
  }

  function* watchForLoadCommit() {
    yield* takeEvery(Commits.actions.LOAD_COMMIT, loadCommit);
  }

  function* watchForLoadCommitsForBranch() {
    yield* takeEvery(Commits.actions.LOAD_COMMITS_FOR_BRANCH, loadCommitsForBranch);
  }

  function* root() {
    yield [
      fork(watchForCreateProject),
      fork(watchForDeleteProject),
      fork(watchForEditProject),
      fork(watchForLoadAllProjects),
      fork(watchForLoadProject),
      fork(watchForLoadBranch),
      fork(watchForLoadBranchesForProject),
      fork(watchForLoadDeployment),
      fork(watchForLoadCommit),
      fork(watchForLoadCommitsForBranch),
      fork(watchForLoadActivities),
      fork(watchForLoadActivitiesForProject),
      fork(watchForFormSubmit),
    ];
  }

  return {
    root,
    watchForLoadDeployment,
    watchForLoadBranch,
    watchForLoadBranchesForProject,
    watchForLoadProject,
    watchForLoadAllProjects,
    watchForLoadCommit,
    watchForLoadCommitsForBranch,
    watchForLoadActivities,
    watchForLoadActivitiesForProject,
    watchForFormSubmit,
    watchForCreateProject,
    watchForDeleteProject,
    watchForEditProject,
    formSubmitSaga,
    createProject,
    editProject,
    deleteProject,
    fetchActivities,
    fetchActivitiesForProject,
    fetchBranch,
    fetchBranchesForProject,
    fetchDeployment,
    fetchProject,
    fetchAllProjects,
    fetchCommit,
    fetchCommitsForBranch,
    loadActivities,
    loadActivitiesForProject,
    loadAllProjects,
    loadBranch,
    loadBranchesForProject,
    loadDeployment,
    loadProject,
    loadCommit,
    loadCommitsForBranch,
    ensureActivitiesRelatedDataLoaded,
    ensureAllProjectsRelatedDataLoaded,
    ensureBranchRelatedDataLoaded,
    ensureBranchesForProjectRelatedDataLoaded,
    ensureDeploymentRelatedDataLoaded,
    ensureCommitRelatedDataLoaded,
    ensureCommitsForBranchRelatedDataLoaded,
    ensureProjectRelatedDataLoaded,
    fetchIfMissing,
    storeIncludedEntities,
  };
}
