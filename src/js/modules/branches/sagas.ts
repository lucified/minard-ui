import { compact } from 'lodash';
import { call, Effect, fork, put, select, take, takeEvery } from 'redux-saga/effects';

import { toBranches } from '../../api/convert';
import { Api, ApiEntity, ApiEntityResponse, ApiEntityTypeString } from '../../api/types';
import { createEntityFetcher, createLoader } from '../../sagas/utils';
import { Commit } from '../commits';
import { FetchError, isFetchError } from '../errors';
import Projects, { Project, StoreProjectsAction } from '../projects';
import Requests from '../requests';
import { LOAD_BRANCH, LOAD_BRANCHES_FOR_PROJECT, storeBranches, UPDATE_BRANCH_WITH_COMMITS } from './actions';
import { getBranch, getBranchesForProject } from './selectors';
import { Branch, LoadBranchesForProjectAction, UpdateBranchWithCommitsAction } from './types';

export default function createSagas(api: Api) {
  // BRANCH
  const fetchBranch = createEntityFetcher(
    Requests.actions.Branches.LoadBranch,
    toBranches,
    storeBranches,
    api.Branch.fetch,
  );

  return {
    sagas: (fetchIfMissing: (type: ApiEntityTypeString, id: string) => IterableIterator<Effect>) => {
      const loadBranch = createLoader(getBranch, fetchBranch, ensureBranchRelatedDataLoaded);

      function* ensureBranchRelatedDataLoaded(id: string): IterableIterator<Effect | Effect[]> {
        const branch = (yield select(getBranch, id)) as Branch | FetchError | undefined;

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
            const commit =
              (yield call(fetchIfMissing, 'commits', branch.latestCommit)) as Commit | FetchError | undefined;
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
        toBranches,
        storeBranches,
        api.Branch.fetchForProject,
        addBranchesToProject,
      );

      function* addBranchesToProject(id: string, response: ApiEntityResponse): IterableIterator<Effect> {
        const branchIds = (response.data as ApiEntity[]).map((branch: any) => branch.id);
        yield put(Projects.actions.addBranchesToProject(id, branchIds));
      }

      function* ensureBranchesForProjectRelatedDataLoaded(id: string): IterableIterator<Effect | Effect[]> {
        const branches = (yield select(getBranchesForProject, id)) as Branch[];

        // Ensure latest deployed commits and deployments exist
        const deployedCommits =
          (yield compact(branches.map(branch => branch.latestSuccessfullyDeployedCommit))
            .map(commitId => call(fetchIfMissing, 'commits', commitId))) as Commit[];
        yield deployedCommits.map(commit => call(fetchIfMissing, 'deployments', commit.deployment));

        // Ensure latest commits exist
        yield compact(branches.map(branch => branch.latestCommit))
          .map(commitId => call(fetchIfMissing, 'commits', commitId));
      }

      return [
        takeEvery(LOAD_BRANCH, loadBranch),
        takeEvery(LOAD_BRANCHES_FOR_PROJECT, loadBranchesForProject),
        takeEvery(UPDATE_BRANCH_WITH_COMMITS, loadLatestCommitForBranch),
      ];
    },
    fetcher: fetchBranch,
  };
}
