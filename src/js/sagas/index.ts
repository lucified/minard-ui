import { compact } from 'lodash';
import { SubmissionError } from 'redux-form';
import { delay, takeEvery, takeLatest } from 'redux-saga';
import { call, Effect, fork, put, race, select, take } from 'redux-saga/effects';

import * as Converter from '../api/convert';
import { Api, ApiEntity, ApiEntityResponse, ApiEntityTypeString, ApiPreviewResponse } from '../api/types';
import { logException, logMessage } from '../logger';
import Activities, { LoadActivitiesAction, LoadActivitiesForProjectAction } from '../modules/activities';
import Branches, {
  Branch,
  LoadBranchesForProjectAction,
  StoreBranchesAction,
  UpdateBranchWithCommitsAction,
} from '../modules/branches';
import Comments, { Comment, CreateCommentAction, LoadCommentsForDeploymentAction } from '../modules/comments';
import Commits, { Commit, LoadCommitsForBranchAction } from '../modules/commits';
import Deployments, { Deployment, StoreDeploymentsAction } from '../modules/deployments';
import { FetchError, isFetchError } from '../modules/errors';
import { FORM_SUBMIT, FormSubmitAction } from '../modules/forms';
import Previews, { LoadPreviewAction, Preview } from '../modules/previews';
import Projects, {
  CreateProjectAction,
  DeleteProjectAction,
  EditProjectAction,
  LoadAllProjectsAction,
  Project,
  StoreProjectsAction,
} from '../modules/projects';
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

  function* checkIfAllActivitiesLoaded(
    response: ApiEntityResponse,
    count: number,
    _until?: number,
  ): IterableIterator<Effect> {
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

    // Return if we're already requesting
    if (yield select(Requests.selectors.isLoadingActivitiesForProject, id)) {
      return;
    }

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

  function* checkIfAllActivitiesLoadedForProject(
    id: string,
    response: ApiEntityResponse,
    count: number,
    _until?: number,
  ): IterableIterator<Effect> {
    if ((<ApiEntity[]> response.data).length < count) {
      yield put(Requests.actions.allActivitiesRequestedForProject(id));
    }
  }

  // ALL PROJECTS
  function* loadAllProjects(_action: LoadAllProjectsAction): IterableIterator<Effect> {
    const fetchSuccess = yield call(fetchAllProjects);
    if (fetchSuccess) {
      yield fork(ensureAllProjectsRelatedDataLoaded);
    }
  }

  const fetchAllProjects = createCollectionFetcher(
    Requests.actions.Projects.LoadAllProjects,
    Converter.toProjects,
    Projects.actions.storeProjects,
    api.Project.fetchAll,
  );

  function* ensureAllProjectsRelatedDataLoaded(): IterableIterator<Effect | Effect[]> {
    const projects = <Project[]> (yield select(Projects.selectors.getProjects));

    if (!projects) {
      logException('Error ensuring project', new Error('No projects found!'));

      return;
    }

    for (const project of projects) {
      yield call(ensureProjectRelatedDataLoaded, project);
    }
  }

  // PROJECT
  const fetchProject = createEntityFetcher(
    Requests.actions.Projects.LoadProject,
    Converter.toProjects,
    Projects.actions.storeProjects,
    api.Project.fetch,
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
      logException('Error ensuring project', new Error('No project found!'), { project });

      return;
    }

    if (isFetchError(project)) {
      logException('Error fetching project', new Error('Unable to fetch project!'), { project });

      return;
    }

    if (project.latestSuccessfullyDeployedCommit) {
      const commit = <Commit | FetchError | undefined> (
        yield call(fetchIfMissing, 'commits', project.latestSuccessfullyDeployedCommit)
      );
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
    api.Branch.fetch,
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
        const commit = <Commit | FetchError | undefined> (yield call(fetchIfMissing, 'commits', branch.latestCommit));
        if (commit && !isFetchError(commit) && commit.deployment) {
          yield call(fetchIfMissing, 'deployments', commit.deployment);
        }
      }
    }
  }

  // BRANCHES_FOR_PROJECT
  function* loadBranchesForProject(action: LoadBranchesForProjectAction): IterableIterator<Effect> {
    const id = action.id;
    let project = <Project | FetchError | undefined> (yield select(Projects.selectors.getProject, id));

    while (!project) {
      const { entities: projects } = <StoreProjectsAction> (yield take(Projects.actions.STORE_PROJECTS));
      project = projects.find(p => p.id === id);
    }

    if (isFetchError(project)) {
      console.error('Project not found. Not fetching branches for project.');
    } else {
      const fetchSuccess = yield call(fetchBranchesForProject, id);
      if (fetchSuccess) {
        yield fork(ensureBranchesForProjectRelatedDataLoaded, id);
      }
    }
  }

  // UPDATE_BRANCH_WITH_COMMITS
  function* loadLatestCommitForBranch(action: UpdateBranchWithCommitsAction): IterableIterator<Effect> {
    yield call(fetchIfMissing, 'commits', action.latestCommitId);
  }

  const fetchBranchesForProject = createEntityFetcher(
    Requests.actions.Branches.LoadBranchesForProject,
    Converter.toBranches,
    Branches.actions.storeBranches,
    api.Branch.fetchForProject,
    addBranchesToProject,
  );

  function* addBranchesToProject(id: string, response: ApiEntityResponse): IterableIterator<Effect> {
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
    api.Deployment.fetch,
  );
  const loadDeployment =
    createLoader(Deployments.selectors.getDeployment, fetchDeployment, ensureDeploymentRelatedDataLoaded);

  function* ensureDeploymentRelatedDataLoaded(_id: string): IterableIterator<Effect> {
    // Nothing to do
  }

  // COMMENTS_FOR_DEPLOYMENT
  function* loadCommentsForDeployment(action: LoadCommentsForDeploymentAction): IterableIterator<Effect> {
    const { id } = action;
    let deployment = <Deployment | FetchError | undefined> (yield select(Deployments.selectors.getDeployment, id));

    // Wait until we've received the deployment before continuing
    while (!deployment) {
      const { entities: deployments } = <StoreDeploymentsAction> (yield take(Deployments.actions.STORE_DEPLOYMENTS));
      deployment = deployments.find(d => d.id === id);
    }

    // Return if we're already requesting
    if (yield select(Requests.selectors.isLoadingCommentsForDeployment, id)) {
      return;
    }

    if (isFetchError(deployment)) {
      logMessage('Deployment not found. Not fetching comments for deployment.', { action });
    } else if (deployment.comments) {
      // Comments already exist. Do nothing.
      // TODO: remove this eventually once we make sure everything works ok
      console.log('Comments already exist in deployment.', deployment);
    } else {
      yield call(fetchCommentsForDeployment, id);
    }
  }

  const fetchCommentsForDeployment = createEntityFetcher(
    Requests.actions.Comments.LoadCommentsForDeployment,
    Converter.toComments,
    Comments.actions.storeComments,
    api.Comment.fetchForDeployment,
    setCommentsForDeployment,
  );

  function* setCommentsForDeployment(
    id: string,
    response: ApiEntityResponse,
  ): IterableIterator<Effect> {
    // The response contains the comments in reverse chronological order
    const commentIds = (<ApiEntity[]> response.data).map((commit: any) => commit.id).reverse();
    yield put(Deployments.actions.setCommentsForDeployment(id, commentIds));
  }

  // CREATE_COMMENT
  function* createComment(action: CreateCommentAction): IterableIterator<Effect> {
    const { name, deployment, email, message } = action.payload;
    const requestName = `${deployment}-${message}`;

    yield put(Requests.actions.Comments.CreateComment.REQUEST.actionCreator(requestName));

    const { response, error, details }: { response?: any, error?: string, details?: string } =
      yield call(api.Comment.create, deployment, message, email, name);

    if (response) {
      // Store new comment
      const commentObjects = <Comment[]> (yield call(Converter.toComments, response.data));
      yield put(Comments.actions.storeComments(commentObjects));
      yield put(Deployments.actions.addCommentsToDeployment(deployment, commentObjects.map(comment => comment.id)));

      // Notify form that creation was a success
      yield put(Requests.actions.Comments.CreateComment.SUCCESS.actionCreator(commentObjects[0], requestName));

      return true;
    } else {
      // Notify form that creation failed
      yield put(Requests.actions.Comments.CreateComment.FAILURE.actionCreator(requestName, error!, details));

      return false;
    }
  }

  // COMMIT
  const fetchCommit = createEntityFetcher(
    Requests.actions.Commits.LoadCommit,
    Converter.toCommits,
    Commits.actions.storeCommits,
    api.Commit.fetch,
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
    let branch = <Branch | FetchError | undefined> (yield select(Branches.selectors.getBranch, id));

    while (!branch) {
      const { entities: branches } = <StoreBranchesAction> (yield take(Branches.actions.STORE_BRANCHES));
      branch = branches.find(b => b.id === id);
    }

    // Return if we're already requesting
    if (yield select(Requests.selectors.isLoadingCommitsForBranch, id)) {
      return;
    }

    if (isFetchError(branch)) {
      console.error('Branch not found. Not fetching commits for branch.');
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

  function* addCommitsToBranch(
    id: string,
    response: ApiEntityResponse,
    count: number,
    _until?: number,
  ): IterableIterator<Effect> {
    const commitIds = (<ApiEntity[]> response.data).map((commit: any) => commit.id);
    yield put(Branches.actions.addCommitsToBranch(id, commitIds, count));
  }

  function* ensureCommitsForBranchRelatedDataLoaded(id: string): IterableIterator<Effect | Effect[]> {
    const branch = <Branch | undefined | FetchError> (yield select(Branches.selectors.getBranch, id));
    if (branch && !isFetchError(branch)) {
      const commits = <Commit[]> (yield branch.commits.map(commitId => call(fetchIfMissing, 'commits', commitId)));
      yield compact(commits.map(commit => commit.deployment))
        .map(deploymentId => call(fetchIfMissing, 'deployments', deploymentId));
    }
  }

  // PREVIEW
  function* loadPreview(action: LoadPreviewAction): IterableIterator<Effect> {
    const id: string = action.id;
    const existingPreview: Preview = yield select(Previews.selectors.getPreview, id);

    if (!existingPreview) {
      yield call(fetchPreview, id);
    }
  }

  function* fetchPreview(id: string): IterableIterator<Effect> {
    yield put(Requests.actions.Previews.LoadPreview.REQUEST.actionCreator(id));

    const { response, error, details }: { response?: ApiPreviewResponse, error?: string, details?: string } =
      yield call(api.Preview.fetch, id);

    if (response) {
      const commit: Commit[] = yield call(Converter.toCommits, response.commit);
      yield put(Commits.actions.storeCommits(commit));

      const deployment: Deployment[] = yield call(Converter.toDeployments, response.deployment);
      yield put(Deployments.actions.storeDeployments(deployment));

      // only store IDs into Preview, not the actual Commit and Deployment objects
      const preview: Preview = Object.assign({}, response, { commit: commit[0].id, deployment: deployment[0].id });
      yield put(Previews.actions.storePreviews(preview));

      yield put(Requests.actions.Previews.LoadPreview.SUCCESS.actionCreator(id));

      return true;
    } else {
      yield put(Requests.actions.Previews.LoadPreview.FAILURE.actionCreator(id, error!, details));

      return false;
    }
  }

  // CREATE PROJECT
  function* createProject(action: CreateProjectAction): IterableIterator<Effect> {
    const { name, description, projectTemplate } = action.payload;

    yield put(Requests.actions.Projects.CreateProject.REQUEST.actionCreator(name));

    const { response, error, details }: { response?: any, error?: string, details?: string } =
      yield call(api.Project.create, name, description, projectTemplate);

    if (response) {
      if (response.included) {
        yield call(storeIncludedEntities, response.included);
      }

      // Store new project
      const projectObject = <Project[]> (yield call(Converter.toProjects, response.data));
      yield put(Projects.actions.storeProjects(projectObject));

      // Notify form that creation was a success
      yield put(Requests.actions.Projects.CreateProject.SUCCESS.actionCreator(projectObject[0], name));

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
      yield call(resolve);
      yield put(Requests.actions.Projects.DeleteProject.SUCCESS.actionCreator(id));

      return true;
    } else {
      yield call(reject);
      yield put(Requests.actions.Projects.DeleteProject.FAILURE.actionCreator(id, error, details));

      return false;
    }
  }

  // Edit PROJECT
  function* editProject(action: EditProjectAction): IterableIterator<Effect> {
    const { id, name } = action.payload;
    // If we don't force description to exist, there would be no way to clear it when editing
    const description = action.payload.description || '';

    yield put(Requests.actions.Projects.EditProject.REQUEST.actionCreator(id));

    const { response, error, details } = yield call(api.Project.edit, id, { name, description });

    if (response) {
      // Store edited project
      const projectObject = yield call(Converter.toProjects, response.data);
      yield put(Projects.actions.storeProjects(projectObject));

      // Notify form that creation was a success
      yield put(Requests.actions.Projects.EditProject.SUCCESS.actionCreator(projectObject[0]));

      return true;
    } else {
      // Notify form that creation failed
      yield put(Requests.actions.Projects.EditProject.FAILURE.actionCreator(id, error, details));

      return false;
    }
  }

  // FORMS
  function* formSubmitSaga({
    payload: {
      submitAction,
      successAction,
      failureAction,
      values,
      resolve,
      reject,
    },
  }: FormSubmitAction): IterableIterator<Effect> {
    yield put({ type: submitAction, payload: values });

    const { success, failure } = yield race({
      success: take(successAction),
      failure: take(failureAction),
    });
    // success is the action generated by the .success() action creator and failure by .failure()

    // Resolve and reject tell the redux-form that submitting is done and if it was successful or not
    if (success) {
      yield call(resolve, success.result);
    } else { // _error indicates that it's a form-wide ("global") error
      yield call(reject, new SubmissionError({ _error: failure.prettyError }));
    }
  }

  // WATCHERS: Watch for specific actions to begin async operations.
  function* watchForFormSubmit() {
    yield takeEvery(FORM_SUBMIT, formSubmitSaga);
  }

  function* watchForCreateProject() {
    yield takeLatest(Projects.actions.CREATE_PROJECT, createProject);
  }

  function* watchForDeleteProject() {
    yield takeLatest(Projects.actions.DELETE_PROJECT, deleteProject);
  }

  function* watchForEditProject() {
    yield takeLatest(Projects.actions.EDIT_PROJECT, editProject);
  }

  function* watchForLoadProject() {
    yield takeEvery(Projects.actions.LOAD_PROJECT, loadProject);
  }

  function* watchForLoadBranch() {
    yield takeEvery(Branches.actions.LOAD_BRANCH, loadBranch);
  }

  function* watchForLoadBranchesForProject() {
    yield takeEvery(Branches.actions.LOAD_BRANCHES_FOR_PROJECT, loadBranchesForProject);
  }

  function* watchForUpdateBranchWithCommits() {
    yield takeEvery(Branches.actions.UPDATE_BRANCH_WITH_COMMITS, loadLatestCommitForBranch);
  }

  function* watchForLoadDeployment() {
    yield takeEvery(Deployments.actions.LOAD_DEPLOYMENT, loadDeployment);
  }

  function* watchForCreateComment() {
    yield takeLatest(Comments.actions.CREATE_COMMENT, createComment);
  }

  function* watchForLoadCommentsForDeployment() {
    yield takeEvery(Comments.actions.LOAD_COMMENTS_FOR_DEPLOYMENT, loadCommentsForDeployment);
  }

  function* watchForLoadCommit() {
    yield takeEvery(Commits.actions.LOAD_COMMIT, loadCommit);
  }

  function* watchForLoadPreview() {
    yield takeEvery(Previews.actions.LOAD_PREVIEW, loadPreview);
  }

  function* watchForLoadActivities(): IterableIterator<Effect> {
    while (true) {
      const action = yield take(Activities.actions.LOAD_ACTIVITIES);
      // Block until it's done, skipping any further actions
      yield call(loadActivities, action);
    }
  }

  function* watchForLoadActivitiesForProject(): IterableIterator<Effect> {
    // TODO: use new throttle helper method once typings work
    while (true) {
      const action = yield take(Activities.actions.LOAD_ACTIVITIES_FOR_PROJECT);
      yield fork(loadActivitiesForProject, action);
      // throttle by 200ms
      yield call(delay, 200);
    }
  }

  function* watchForLoadAllProjects(): IterableIterator<Effect> {
    while (true) {
      const action = yield take(Projects.actions.LOAD_ALL_PROJECTS);
      // Block until it's done, skipping any further actions
      yield call(loadAllProjects, action);
    }
  }

  function* watchForLoadCommitsForBranch(): IterableIterator<Effect> {
    // TODO: use new throttle helper method once typings work
    while (true) {
      const action = yield take(Commits.actions.LOAD_COMMITS_FOR_BRANCH);
      yield fork(loadCommitsForBranch, action);
      // throttle by 200ms
      yield call(delay, 200);
    }
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
      fork(watchForCreateComment),
      fork(watchForLoadCommentsForDeployment),
      fork(watchForLoadCommit),
      fork(watchForLoadCommitsForBranch),
      fork(watchForLoadActivities),
      fork(watchForLoadActivitiesForProject),
      fork(watchForLoadPreview),
      fork(watchForFormSubmit),
      fork(watchForUpdateBranchWithCommits),
    ];
  }

  return {
    root,
    watchForLoadDeployment,
    watchForLoadBranch,
    watchForLoadBranchesForProject,
    watchForLoadProject,
    watchForLoadAllProjects,
    watchForLoadCommentsForDeployment,
    watchForLoadCommit,
    watchForLoadCommitsForBranch,
    watchForLoadActivities,
    watchForLoadActivitiesForProject,
    watchForFormSubmit,
    watchForCreateProject,
    watchForDeleteProject,
    watchForEditProject,
    watchForUpdateBranchWithCommits,
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
    loadLatestCommitForBranch,
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
