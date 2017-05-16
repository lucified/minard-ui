import { compact } from 'lodash';
import { call, Effect, fork, put, select, take, takeEvery, throttle } from 'redux-saga/effects';

import { toCommits } from '../../api/convert';
import { Api, ApiEntity, ApiEntityResponse } from '../../api/types';
import { createEntityFetcher, createLoader, fetchIfMissing } from '../../sagas/utils';
import Branches, { Branch, StoreBranchesAction } from '../branches';
import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';
import { FETCH_COMMIT, LOAD_COMMIT, LOAD_COMMITS_FOR_BRANCH, storeCommits } from './actions';
import { getCommit } from './selectors';
import { Commit, FetchCommitAction, LoadCommitsForBranchAction } from './types';

export default function createSagas(api: Api) {
  const fetchCommit = createEntityFetcher(
    Requests.actions.Commits.LoadCommit,
    toCommits,
    storeCommits,
    api.Commit.fetch,
  );

  const loadCommit = createLoader(getCommit, fetchCommit, ensureCommitRelatedDataLoaded);

  function* ensureCommitRelatedDataLoaded(id: string): IterableIterator<Effect> {
    const commit = (yield select(getCommit, id)) as Commit | undefined | FetchError;

    if (commit && !isFetchError(commit) && commit.deployment) {
      yield call(fetchIfMissing, 'deployments', commit.deployment);
    }
  }

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
    toCommits,
    storeCommits,
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

  function* startFetchCommit(action: FetchCommitAction) {
    yield call(fetchCommit, action.id);
  }

  return {
    sagas: [
      takeEvery(LOAD_COMMIT, loadCommit),
      takeEvery(FETCH_COMMIT, startFetchCommit),
      throttle(200, LOAD_COMMITS_FOR_BRANCH, loadCommitsForBranch),
    ],
  };
}
