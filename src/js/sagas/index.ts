import { Effect, call, fork, put, select, take } from 'redux-saga/effects';

import * as api from '../api';

import branches, { Branch } from '../modules/branches';
import commits from '../modules/commits';
import { FetchEntityActionCreators } from '../modules/common';
import projects, { Project } from '../modules/projects';

interface ApiFunction {
  (id?: string): Promise<{ response: any } | { error: any }>;
}

// resuable fetch subroutine
function* fetchEntity(
  entity: FetchEntityActionCreators,
  apiFunction: ApiFunction,
  id: string
): IterableIterator<Effect> {
  yield put(entity.request(id));
  const { response, error } = yield call(apiFunction, id);
  if (response) {
    yield put(entity.success(id, response));
  } else {
    yield put(entity.failure(id, error));
  }
}

// yeah! we can also bind Generators
export const fetchCommits    = fetchEntity.bind(null, commits.actions, api.fetchCommits);
export const fetchBranches    = fetchEntity.bind(null, branches.actions, api.fetchBranches);

function* fetchProjects(): IterableIterator<Effect> {
  yield put(projects.actions.requestActionCreators.request());
  const { response, error } = yield call(api.fetchProjects);
  if (response) {
    yield put(projects.actions.requestActionCreators.success(response));
  } else {
    yield put(projects.actions.requestActionCreators.failure(error));
  }
}


function* loadProjects(): IterableIterator<Effect> {
  const existingProjects = yield select(projects.selectors.getProjects);
  if (!existingProjects || existingProjects.length === 0) {
    yield call(fetchProjects);
  }
}

function* loadCommitsForBranch(branch: Branch): IterableIterator<Effect> {
  const commitsToCheck = branch.commits.slice();
  let commitId: string;
  let needToFetch = false;

  while (commitId = commitsToCheck.shift()) {
    const existingCommit = yield select(commits.selectors.getCommit, commitId);
    if (!existingCommit) {
      needToFetch = true;
      break;
    }
  }

  if (needToFetch) {
    yield call(fetchCommits, branch.id);
  }
}

function* loadBranchesForProject(project: Project): IterableIterator<Effect> {
  const branchesToCheck = project.branches.slice();
  let branchId: string;
  let needToFetch = false;

  while (branchId = branchesToCheck.shift()) {
    const existingBranch = yield select(branches.selectors.getBranch, branchId);
    if (!existingBranch) {
      needToFetch = true;
      break;
    }
  }

  if (needToFetch) {
    yield call(fetchBranches, project.id);
  }
}


function* watchForLoadProjects(): IterableIterator<Effect> {
  while (true) {
    yield take(projects.actions.LOAD_ALL_PROJECTS);

    yield fork(loadProjects);
  }
}

function* watchForLoadCommits(): IterableIterator<Effect> {
  while (true) {
    const { branch } = yield take(commits.actions.LOAD_COMMITS_FOR_BRANCH);
    yield fork(loadCommitsForBranch, <Branch>branch);
  }
}

function* watchForLoadBranches(): IterableIterator<Effect> {
  while (true) {
    const { project } = yield take(branches.actions.LOAD_BRANCHES_FOR_PROJECT);
    yield fork(loadBranchesForProject, <Project>project);
  }
}

export default function* root() {
  yield [
    fork(watchForLoadProjects),
    fork(watchForLoadBranches),
    fork(watchForLoadCommits),
  ];
}
