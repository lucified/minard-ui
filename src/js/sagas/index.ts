import { compact } from 'lodash';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form';
import { takeEvery, takeLatest, throttle } from 'redux-saga';
import { call, Effect, fork, put, race, select, take } from 'redux-saga/effects';

import { clearStoredCredentials } from '../api/auth';
import * as Converter from '../api/convert';
import {
  Api,
  ApiEntity,
  ApiEntityResponse,
  ApiEntityTypeString,
  ApiPreviewResponse,
  ApiTeam,
  SignupResponse,
} from '../api/types';
import { logout as intercomLogout } from '../intercom';
import { logException, logMessage } from '../logger';
import Activities, { LoadActivitiesAction, LoadActivitiesForProjectAction } from '../modules/activities';
import Branches, {
  Branch,
  LoadBranchesForProjectAction,
  StoreBranchesAction,
  UpdateBranchWithCommitsAction,
} from '../modules/branches';
import Comments, {
  Comment,
  CreateCommentAction,
  DeleteCommentAction,
} from '../modules/comments';
import Commits, { Commit, LoadCommitsForBranchAction } from '../modules/commits';
import Deployments, { Deployment } from '../modules/deployments';
import Errors, {
  CreateError,
  EditError,
  FetchError,
  isFetchError,
} from '../modules/errors';
import { FORM_SUBMIT, FormSubmitAction } from '../modules/forms';
import Previews, { EntityType, LoadPreviewAndCommentsAction, Preview } from '../modules/previews';
import Projects, {
  CreateProjectAction,
  DeleteProjectAction,
  EditProjectAction,
  LoadAllProjectsAction,
  Project,
  StoreProjectsAction,
} from '../modules/projects';
import Requests, { CreateEntitySuccessAction, EditEntitySuccessAction } from '../modules/requests';
import User, { LoadTeamInformationAction, RedirectToLoginAction, SignupUserAction } from '../modules/user';

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

    const selector = (selectors as any)[type];
    const fetcher = (fetchers as any)[type];

    let existingEntity = yield select(selector, id);

    if (!existingEntity || isFetchError(existingEntity)) {
      yield call(fetcher, id);
      existingEntity = yield select(selector, id);
    }

    return existingEntity;
  }

  // ALL ACTIVITIES
  function* loadActivities(action: LoadActivitiesAction): IterableIterator<Effect> {
    const { teamId, count, until } = action;
    const fetchSuccess = yield call(fetchActivities, teamId, count, until);
    if (fetchSuccess) {
      yield fork(ensureActivitiesRelatedDataLoaded);
    }
  }

  const fetchActivities = createCollectionFetcher<string | number | undefined>(
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
    if ((response.data as ApiEntity[]).length < count) {
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
    if ((response.data as ApiEntity[]).length < count) {
      yield put(Requests.actions.allActivitiesRequestedForProject(id));
    }
  }

  // ALL PROJECTS
  function* loadAllProjects(action: LoadAllProjectsAction): IterableIterator<Effect> {
    const { teamId } = action;
    const fetchSuccess = yield call(fetchAllProjects, teamId);
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
    const projects = (yield select(Projects.selectors.getProjects)) as Project[];

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
      project = (yield select(Projects.selectors.getProject, projectOrId)) as Project | FetchError | undefined;
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
      const commit = (
        yield call(fetchIfMissing, 'commits', project.latestSuccessfullyDeployedCommit)
      ) as Commit | FetchError | undefined;
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
    const branch = (yield select(Branches.selectors.getBranch, id)) as Branch | FetchError | undefined;

    if (branch && !isFetchError(branch)) {
      yield call(fetchIfMissing, 'projects', branch.project);
      if (branch.latestSuccessfullyDeployedCommit) {
        const commit = (
          yield call(fetchIfMissing, 'commits', branch.latestSuccessfullyDeployedCommit)
        ) as Commit | FetchError | undefined;
        if (commit && !isFetchError(commit) && commit.deployment) {
          yield call(fetchIfMissing, 'deployments', commit.deployment);
        }
      }
      if (branch.latestCommit) {
        const commit = (yield call(fetchIfMissing, 'commits', branch.latestCommit)) as Commit | FetchError | undefined;
        if (commit && !isFetchError(commit) && commit.deployment) {
          yield call(fetchIfMissing, 'deployments', commit.deployment);
        }
      }
    }
  }

  // BRANCHES_FOR_PROJECT
  function* loadBranchesForProject(action: LoadBranchesForProjectAction): IterableIterator<Effect> {
    const id = action.id;
    let project = (yield select(Projects.selectors.getProject, id)) as Project | FetchError | undefined;

    while (!project) {
      const { entities: projects } = (yield take(Projects.actions.STORE_PROJECTS)) as StoreProjectsAction;
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
    const branchIds = (response.data as ApiEntity[]).map((branch: any) => branch.id);
    yield put(Projects.actions.addBranchesToProject(id, branchIds));
  }

  function* ensureBranchesForProjectRelatedDataLoaded(id: string): IterableIterator<Effect | Effect[]> {
    const branches = (yield select(Branches.selectors.getBranchesForProject, id)) as Branch[];

    // Ensure latest deployed commits and deployments exist
    const deployedCommits =
      (yield compact(branches.map(branch => branch.latestSuccessfullyDeployedCommit))
        .map(commitId => call(fetchIfMissing, 'commits', commitId))) as Commit[];
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
  function* loadCommentsForDeployment(id: string): IterableIterator<Effect> {
    const deployment = (yield select(Deployments.selectors.getDeployment, id)) as Deployment | FetchError | undefined;

    // Return if we're already requesting
    if (yield select(Requests.selectors.isLoadingCommentsForDeployment, id)) {
      return;
    }

    if (!deployment || isFetchError(deployment)) {
      logMessage('Deployment not found. Not fetching comments for deployment.', { id });
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
    const commentIds = (response.data as ApiEntity[]).map((commit: any) => commit.id).reverse();
    yield put(Deployments.actions.setCommentsForDeployment(id, commentIds));
  }

  // DELETE_COMMENT
  function* deleteComment(action: DeleteCommentAction): IterableIterator<Effect> {
    const { id } = action;

    yield put(Requests.actions.Comments.DeleteComment.REQUEST.actionCreator(id));

    const { response, error, details, unauthorized } = yield call(api.Comment.delete, id);

    if (response) {
      yield put(Requests.actions.Comments.DeleteComment.SUCCESS.actionCreator(id));

      return true;
    } else {
      yield put(Requests.actions.Comments.DeleteComment.FAILURE.actionCreator(id, error, details, unauthorized));

      return false;
    }
  }

  // CREATE_COMMENT
  function* createComment(action: CreateCommentAction): IterableIterator<Effect> {
    const { name, deployment, email, message } = action.payload;
    const requestName = `${deployment}-${message}`;

    yield put(Requests.actions.Comments.CreateComment.REQUEST.actionCreator(requestName));

    const { response, error, details, unauthorized }: {
      response?: any,
      error?: string,
      details?: string,
      unauthorized?: boolean,
    } = yield call(api.Comment.create, deployment, message, email, name);

    if (response) {
      // Store new comment
      const commentObjects = (yield call(Converter.toComments, response.data)) as Comment[];
      yield put(Comments.actions.storeComments(commentObjects));
      yield put(Deployments.actions.addCommentsToDeployment(deployment, commentObjects.map(comment => comment.id)));

      // Notify form that creation was a success
      yield put(Requests.actions.Comments.CreateComment.SUCCESS.actionCreator(commentObjects[0], requestName));

      return true;
    } else {
      // Notify form that creation failed
      yield put(
        Requests.actions.Comments.CreateComment.FAILURE.actionCreator(requestName, error!, details, unauthorized),
      );

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
    const commit = (yield select(Commits.selectors.getCommit, id)) as Commit | undefined | FetchError;

    if (commit && !isFetchError(commit) && commit.deployment) {
      yield call(fetchIfMissing, 'deployments', commit.deployment);
    }
  }

  // COMMITS_FOR_BRANCH
  function* loadCommitsForBranch(action: LoadCommitsForBranchAction): IterableIterator<Effect> {
    const { id, count, until } = action;
    let branch = (yield select(Branches.selectors.getBranch, id)) as Branch | FetchError | undefined;

    while (!branch) {
      const { entities: branches } = (yield take(Branches.actions.STORE_BRANCHES)) as StoreBranchesAction;
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
    const commitIds = (response.data as ApiEntity[]).map((commit: any) => commit.id);
    yield put(Branches.actions.addCommitsToBranch(id, commitIds, count));
  }

  function* ensureCommitsForBranchRelatedDataLoaded(id: string): IterableIterator<Effect | Effect[]> {
    const branch = (yield select(Branches.selectors.getBranch, id)) as Branch | undefined | FetchError;
    if (branch && !isFetchError(branch)) {
      const commits = (yield branch.commits.map(commitId => call(fetchIfMissing, 'commits', commitId))) as Commit[];
      yield compact(commits.map(commit => commit.deployment))
        .map(deploymentId => call(fetchIfMissing, 'deployments', deploymentId));
    }
  }

  // PREVIEW
  function* loadPreviewAndComments(action: LoadPreviewAndCommentsAction): IterableIterator<Effect> {
    const { id, token, isUserLoggedIn, entityType } = action;
    const existingPreview: Preview = yield select(Previews.selectors.getPreview, id, entityType);
    let previewExists = !!existingPreview;

    if (!previewExists || isFetchError(existingPreview)) {
      previewExists = yield call(fetchPreview, id, entityType, token, isUserLoggedIn);
    }

    if (previewExists) {
      const preview: Preview = yield select(Previews.selectors.getPreview, id, entityType);
      if (preview && !isFetchError(preview)) {
        yield call(loadCommentsForDeployment, preview.deployment);
      }
    }
  }

  function* fetchPreview(
    id: string,
    entityType: EntityType,
    token: string,
    isUserLoggedIn: boolean,
  ): IterableIterator<Effect> {
    yield put(Requests.actions.Previews.LoadPreview.REQUEST.actionCreator(id));

    const { response, error, details, unauthorized }: {
      response?: ApiPreviewResponse,
      error?: string,
      details?: string,
      unauthorized?: boolean,
    } = yield call(api.Preview.fetch, id, entityType, token);

    if (response) {
      const commit: Commit[] = yield call(Converter.toCommits, response.commit);
      yield put(Commits.actions.storeCommits(commit));

      const deployment: Deployment[] = yield call(Converter.toDeployments, response.deployment);
      yield put(Deployments.actions.storeDeployments(deployment));

      // only store IDs into Preview, not the actual Commit and Deployment objects
      const preview: Preview = { ...response, commit: commit[0].id, deployment: deployment[0].id };
      yield put(Previews.actions.storePreviews(preview, id, entityType));

      yield put(Requests.actions.Previews.LoadPreview.SUCCESS.actionCreator(id));

      return true;
    } else {
      yield put(
        Requests.actions.Previews.LoadPreview.FAILURE.actionCreator(
          `${entityType}-${id}`, // TODO: Manually specifying this here is ugly. Fix it up at some point.
          error!,
          details,
          unauthorized,
        ),
      );

      if (unauthorized && !isUserLoggedIn) {
        yield put(User.actions.redirectToLogin(`/preview/${entityType}/${id}/${token}`));
      }

      return false;
    }
  }

  // CREATE PROJECT
  function* createProject(action: CreateProjectAction): IterableIterator<Effect> {
    const { name, description, projectTemplate, teamId } = action.payload;

    yield put(Requests.actions.Projects.CreateProject.REQUEST.actionCreator(name));

    const { response, error, details, unauthorized }: {
      response?: any,
      error?: string,
      details?: string,
      unauthorized?: boolean,
    } = yield call(api.Project.create, teamId, name, description, projectTemplate);

    if (response) {
      if (response.included) {
        yield call(storeIncludedEntities, response.included);
      }

      // Store new project
      const projectObject = (yield call(Converter.toProjects, response.data)) as Project[];
      yield put(Projects.actions.storeProjects(projectObject));

      // Notify form that creation was a success
      yield put(Requests.actions.Projects.CreateProject.SUCCESS.actionCreator(projectObject[0], name));

      return true;
    } else {
      // Notify form that creation failed
      yield put(Requests.actions.Projects.CreateProject.FAILURE.actionCreator(name, error!, details, unauthorized));

      return false;
    }
  }

  // Delete PROJECT
  function* deleteProject(action: DeleteProjectAction): IterableIterator<Effect> {
    const { id, resolve, reject } = action;

    yield put(Requests.actions.Projects.DeleteProject.REQUEST.actionCreator(id));

    const { response, error, details, unauthorized } = yield call(api.Project.delete, id);

    if (response) {
      yield call(resolve);
      yield put(Requests.actions.Projects.DeleteProject.SUCCESS.actionCreator(id));

      return true;
    } else {
      yield call(reject);
      yield put(Requests.actions.Projects.DeleteProject.FAILURE.actionCreator(id, error, details, unauthorized));

      return false;
    }
  }

  // Edit PROJECT
  function* editProject(action: EditProjectAction): IterableIterator<Effect> {
    const { id, name } = action.payload;
    // If we don't force description to exist, there would be no way to clear it when editing
    const description = action.payload.description || '';

    yield put(Requests.actions.Projects.EditProject.REQUEST.actionCreator(id));

    const { response, error, details, unauthorized } = yield call(api.Project.edit, id, { name, description });

    if (response) {
      // Store edited project
      const projectObject = yield call(Converter.toProjects, response.data);
      yield put(Projects.actions.storeProjects(projectObject));

      // Notify form that creation was a success
      yield put(Requests.actions.Projects.EditProject.SUCCESS.actionCreator(projectObject[0]));

      return true;
    } else {
      // Notify form that creation failed
      yield put(Requests.actions.Projects.EditProject.FAILURE.actionCreator(id, error, details, unauthorized));

      return false;
    }
  }

  // User
  function *loadTeamInformation(_action: LoadTeamInformationAction): IterableIterator<Effect> {
    yield put(Requests.actions.User.LoadTeamInformation.REQUEST.actionCreator());

    const { response, error, details, unauthorized } = yield call(api.Team.fetch);

    if (response) {
      const { id, name, 'invitation-token': invitationToken } = response as ApiTeam;
      yield put(User.actions.setTeam(String(id), name, invitationToken));
      yield put(Requests.actions.User.LoadTeamInformation.SUCCESS.actionCreator());

      return true;
    } else {
      // TODO: handle failure, e.g. not authorized or member of team
      yield put(Requests.actions.User.LoadTeamInformation.FAILURE.actionCreator(error, details, unauthorized));

      return false;
    }
  }

  function *signupUser(_action: SignupUserAction): IterableIterator<Effect> {
    yield put(Errors.actions.clearSignupError());
    const { response, error, details } = yield call(api.User.signup);

    if (response) {
      const { password, team: { id, name } } = response as SignupResponse;
      yield put(User.actions.setTeam(String(id), name));
      yield put(User.actions.setGitPassword(password));

      return true;
    } else {
      console.error('signupUser error', error, details);
      yield put(Errors.actions.signupError(error, details));

      return false;
    }
  }

  function *redirectToLogin(action: RedirectToLoginAction): IterableIterator<Effect> {
    const { returnPath } = action;

    if (returnPath) {
      yield put(push(`/login/${encodeURIComponent(returnPath)}`));
    } else {
      yield put(push('/login'));
    }
  }

  function *logout(): IterableIterator<Effect> {
    const { error, unauthorized } = yield call(api.User.logout);

    if (error) {
      if (unauthorized) {
        console.error('Unable to clear cookie: Unauthorized');
      } else {
        console.error(`Unable to clear cookie: ${error}`);
      }
    }

    intercomLogout();
    yield put(User.actions.clearStoredData());
    yield put(User.actions.clearUserDetails());
    clearStoredCredentials();
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

    const { success, failure }: {
      success: CreateEntitySuccessAction | EditEntitySuccessAction,
      failure: CreateError | EditError,
    } = yield race({
      success: take(successAction),
      failure: take(failureAction),
    });
    // success is the action generated by the .success() action creator and failure by .failure()

    // Resolve and reject tell the redux-form that submitting is done and if it was successful or not
    if (success) {
      yield call(resolve, success.result);
    } else { // _error indicates that it's a form-wide ("global") error
      yield call(reject, new SubmissionError({ _error: failure.details || failure.prettyError }));
    }
  }

  // WATCHERS: Watch for specific actions to begin async operations.
  function* watchForLoadActivities(): IterableIterator<Effect> {
    while (true) {
      const action = yield take(Activities.actions.LOAD_ACTIVITIES);
      // Block until it's done, skipping any further actions
      yield call(loadActivities, action);
    }
  }

  function* watchForLoadAllProjects(): IterableIterator<Effect> {
    while (true) {
      const action = yield take(Projects.actions.LOAD_ALL_PROJECTS);
      // Block until it's done, skipping any further actions
      yield call(loadAllProjects, action);
    }
  }

  function* watchForLoadTeamInformation(): IterableIterator<Effect> {
    while (true) {
      const action = yield take(User.actions.LOAD_TEAM_INFORMATION);
      // Block until it's done, skipping any further actions
      yield call(loadTeamInformation, action);
    }
  }

  function* watchForSignupUser(): IterableIterator<Effect> {
    while (true) {
      const action = yield take(User.actions.SIGNUP_USER);
      // Block until it's done, skipping any further actions
      yield call(signupUser, action);
    }
  }

  function* root() {
    yield [
      takeLatest(Projects.actions.CREATE_PROJECT, createProject),
      takeLatest(Projects.actions.DELETE_PROJECT, deleteProject),
      takeLatest(Projects.actions.EDIT_PROJECT, editProject),
      takeEvery(Projects.actions.LOAD_PROJECT, loadProject),
      takeEvery(Branches.actions.LOAD_BRANCH, loadBranch),
      takeEvery(Branches.actions.LOAD_BRANCHES_FOR_PROJECT, loadBranchesForProject),
      takeEvery(Branches.actions.UPDATE_BRANCH_WITH_COMMITS, loadLatestCommitForBranch),
      takeEvery(Deployments.actions.LOAD_DEPLOYMENT, loadDeployment),
      takeLatest(Comments.actions.CREATE_COMMENT, createComment),
      takeEvery(Comments.actions.DELETE_COMMENT, deleteComment),
      takeEvery(Commits.actions.LOAD_COMMIT, loadCommit),
      throttle(200, Commits.actions.LOAD_COMMITS_FOR_BRANCH, loadCommitsForBranch),
      takeEvery(Previews.actions.LOAD_PREVIEW_AND_COMMENTS, loadPreviewAndComments),
      takeEvery(FORM_SUBMIT, formSubmitSaga),
      throttle(200, Activities.actions.LOAD_ACTIVITIES_FOR_PROJECT, loadActivitiesForProject),
      takeEvery(User.actions.LOGOUT, logout),
      takeEvery(User.actions.REDIRECT_TO_LOGIN, redirectToLogin),
      fork(watchForLoadAllProjects),
      fork(watchForLoadActivities),
      fork(watchForLoadTeamInformation),
      fork(watchForSignupUser),
    ];
  }

  return {
    root,
    watchForLoadAllProjects,
    watchForLoadActivities,
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
