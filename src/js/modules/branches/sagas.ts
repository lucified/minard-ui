import { compact } from 'lodash';
import {
  call,
  Effect,
  fork,
  put,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects';

import { toBranches } from '../../api/convert';
import { Api, ApiEntity, ApiEntityResponse } from '../../api/types';
import {
  createEntityFetcher,
  createLoader,
  fetchIfMissing,
} from '../../sagas/utils';
import { Commit } from '../commits';
import { FetchError, isFetchError } from '../errors';
import Projects, { Project, StoreProjectsAction } from '../projects';
import Requests from '../requests';
import {
  FETCH_BRANCH,
  LOAD_BRANCH,
  LOAD_BRANCHES_FOR_PROJECT,
  storeBranches,
  UPDATE_BRANCH_WITH_COMMITS,
} from './actions';
import { getBranch, getBranchesForProject } from './selectors';
import {
  Branch,
  FetchBranchAction,
  LoadBranchesForProjectAction,
  UpdateBranchWithCommitsAction,
} from './types';

export default function createSagas(api: Api) {
  const fetchBranch = createEntityFetcher(
    Requests.actions.Branches.LoadBranch,
    toBranches,
    storeBranches,
    api.Branch.fetch,
  );

  const loadBranch = createLoader(
    getBranch,
    fetchBranch,
    ensureBranchRelatedDataLoaded,
  );

  function* ensureBranchRelatedDataLoaded(
    id: string,
  ): IterableIterator<Effect | Effect[]> {
    const branch: Branch | FetchError | undefined = yield select(getBranch, id);

    if (branch && !isFetchError(branch)) {
      yield call(fetchIfMissing, 'projects', branch.project);
      if (branch.latestSuccessfullyDeployedCommit) {
        const commit: Commit | FetchError | undefined = yield call(
          fetchIfMissing,
          'commits',
          branch.latestSuccessfullyDeployedCommit,
        );
        if (commit && !isFetchError(commit) && commit.deployment) {
          yield call(fetchIfMissing, 'deployments', commit.deployment);
        }
      }
      if (branch.latestCommit) {
        const commit: Commit | FetchError | undefined = yield call(
          fetchIfMissing,
          'commits',
          branch.latestCommit,
        );
        if (commit && !isFetchError(commit) && commit.deployment) {
          yield call(fetchIfMissing, 'deployments', commit.deployment);
        }
      }
    }
  }

  // BRANCHES_FOR_PROJECT
  function* loadBranchesForProject(
    action: LoadBranchesForProjectAction,
  ): IterableIterator<Effect> {
    const id = action.id;
    let project: Project | FetchError | undefined = yield select(
      Projects.selectors.getProject,
      id,
    );

    while (!project) {
      const { entities: projects }: StoreProjectsAction = yield take(
        Projects.actions.STORE_PROJECTS,
      );
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
  function* loadLatestCommitForBranch(
    action: UpdateBranchWithCommitsAction,
  ): IterableIterator<Effect> {
    yield call(fetchIfMissing, 'commits', action.latestCommitId);
  }

  const fetchBranchesForProject = createEntityFetcher(
    Requests.actions.Branches.LoadBranchesForProject,
    toBranches,
    storeBranches,
    api.Branch.fetchForProject,
    addBranchesToProject,
  );

  function* addBranchesToProject(
    id: string,
    response: ApiEntityResponse,
  ): IterableIterator<Effect> {
    const branchIds = (response.data as ApiEntity[]).map(
      (branch: any) => branch.id,
    );
    yield put(Projects.actions.addBranchesToProject(id, branchIds));
  }

  function* ensureBranchesForProjectRelatedDataLoaded(
    id: string,
  ): IterableIterator<Effect | Effect[]> {
    const branches: Branch[] = yield select(getBranchesForProject, id);

    // Ensure latest deployed commits and deployments exist
    const deployedCommits: Commit[] = yield compact(
      branches.map(branch => branch.latestSuccessfullyDeployedCommit),
    ).map(commitId => call(fetchIfMissing, 'commits', commitId));
    yield deployedCommits.map(commit =>
      call(fetchIfMissing, 'deployments', commit.deployment),
    );

    // Ensure latest commits exist
    yield compact(branches.map(branch => branch.latestCommit)).map(commitId =>
      call(fetchIfMissing, 'commits', commitId),
    );
  }

  function* startFetchBranch(action: FetchBranchAction) {
    yield call(fetchBranch, action.id);
  }

  return {
    functions: {
      fetchBranch,
      loadBranch,
      ensureBranchesForProjectRelatedDataLoaded,
      ensureBranchRelatedDataLoaded,
      addBranchesToProject,
      loadBranchesForProject,
      fetchBranchesForProject,
    },
    sagas: [
      takeEvery(LOAD_BRANCH, loadBranch),
      takeEvery(LOAD_BRANCHES_FOR_PROJECT, loadBranchesForProject),
      takeEvery(UPDATE_BRANCH_WITH_COMMITS, loadLatestCommitForBranch),
      takeEvery(FETCH_BRANCH, startFetchBranch),
    ],
  };
}
