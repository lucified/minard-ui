// tslint:disable:no-object-literal-type-assertion

import { expect } from 'chai';
import { call, fork, put, select, take } from 'redux-saga/effects';

import { toCommits } from '../../api/convert';
import Branches, { Branch } from '../branches';
import Commits, { Commit } from '../commits';
import Requests from '../requests';
import { LoadCommitsForBranchAction } from './index';

import { createApi, testData, testEntityFetcherSaga, testLoaderSaga } from '../../../../test/test-utils';
import { fetchIfMissing, storeIncludedEntities } from '../../sagas/utils';
import createSagas from './sagas';

describe('Commits sagas', () => {
  const api = createApi();
  const sagaFunctions = createSagas(api).functions;

  testLoaderSaga(
    'loadCommit',
    sagaFunctions.loadCommit,
    Commits.selectors.getCommit,
    sagaFunctions.fetchCommit,
    sagaFunctions.ensureCommitRelatedDataLoaded,
  );

  describe('loadCommitsForBranch', () => {
    const action: LoadCommitsForBranchAction = {
      type: Commits.actions.LOAD_COMMITS_FOR_BRANCH,
      id: '1',
      count: 10,
      until: 1234567,
    };

    it('calls fetchCommitsForBranch if branch exists', () => {
      const iterator = sagaFunctions.loadCommitsForBranch(action);

      expect(iterator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, action.id),
      );

      expect(iterator.next({ id: action.id }).value).to.deep.equal(
        select(Requests.selectors.isLoadingCommitsForBranch, action.id),
      );

      expect(iterator.next(false).value).to.deep.equal(
        call(sagaFunctions.fetchCommitsForBranch, action.id, action.count, action.until),
      );
    });

    it('does not fetch if similar request is already underway', () => {
      const iterator = sagaFunctions.loadCommitsForBranch(action);

      expect(iterator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, action.id),
      );

      expect(iterator.next({ id: action.id }).value).to.deep.equal(
        select(Requests.selectors.isLoadingCommitsForBranch, action.id),
      );

      expect(iterator.next(true).done).to.equal(true);
    });

    it('calls fetchCommitsForBranch only once branch has been received', () => {
      const iterator = sagaFunctions.loadCommitsForBranch(action);

      expect(iterator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, action.id),
      );

      expect(iterator.next().value).to.deep.equal(
        take(Branches.actions.STORE_BRANCHES),
      );

      expect(iterator.next({ entities: [{ id: 'foo' }]}).value).to.deep.equal(
        take(Branches.actions.STORE_BRANCHES),
      );

      expect(iterator.next({ entities: [{ id: 'bar' }, { id: action.id }]}).value).to.deep.equal(
        select(Requests.selectors.isLoadingCommitsForBranch, action.id),
      );

      expect(iterator.next(false).value).to.deep.equal(
        call(sagaFunctions.fetchCommitsForBranch, action.id, action.count, action.until),
      );
    });

    it('does nothing if another request for the same branch is ongoing', () => {
      const iterator = sagaFunctions.loadCommitsForBranch(action);

      iterator.next(); // Select
      iterator.next({ id: action.id }); // Select
      iterator.next(true);
      expect(iterator.next().done).to.equal(true);
    });

    it('ensures needed data exists if fetch was a success', () => {
      const iterator = sagaFunctions.loadCommitsForBranch(action);

      iterator.next(); // Select
      iterator.next({ id: action.id }); // Select
      iterator.next(false);
      expect(iterator.next(true).value).to.deep.equal(
        fork(sagaFunctions.ensureCommitsForBranchRelatedDataLoaded, action.id),
      );
      expect(iterator.next().done).to.equal(true);
    });

    it('does not ensure needed data if fetch was a failure', () => {
      const iterator = sagaFunctions.loadCommitsForBranch(action);

      iterator.next();
      iterator.next({ id: action.id });
      iterator.next(false);
      expect(iterator.next(false).done).to.equal(true);
    });
  });

  describe('loadLatestCommitForBranch', () => {
    it('fetches latest commit if it is missing');
    it('does not fetch latest commit if it already exists');
  });

  testEntityFetcherSaga(
    'fetchCommit',
    testData.commitResponse,
    { data: testData.commitResponse.data },
    Requests.actions.Commits.LoadCommit,
    sagaFunctions.fetchCommit,
    api.Commit.fetch,
    toCommits,
    Commits.actions.storeCommits,
  );

  describe('fetchCommitsForBranch', () => {
    const id = 'id';

    it('fetches, converts and stores commits', () => {
      const response = { data: testData.branchCommitsResponse.data };
      const count = 10;
      const until = undefined;
      const iterator = sagaFunctions.fetchCommitsForBranch(id, count, until);
      const objects = [{ id: '1' }, { id: '2' }, { id: '3' }];

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Commits.LoadCommitsForBranch.REQUEST.actionCreator(id)),
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Commit.fetchForBranch, id, count, until),
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        call(toCommits, response.data),
      );

      expect(iterator.next(objects).value).to.deep.equal(
        put(Commits.actions.storeCommits(objects as any)),
      );

      expect(iterator.next().value).to.deep.equal(
        put(Branches.actions.addCommitsToBranch(
          id,
          ['aacceeff02', '12354124', '2543452', '098325343', '29832572fc1', '29752a385'],
          count,
        )),
      );

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Commits.LoadCommitsForBranch.SUCCESS.actionCreator(id)),
      );

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('fetches and stores included data', () => {
      const response = testData.branchCommitsResponse;
      const count = 10;
      const until = undefined;
      const iterator = sagaFunctions.fetchCommitsForBranch(id, count, until);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Commits.LoadCommitsForBranch.REQUEST.actionCreator(id)),
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Commit.fetchForBranch, id, count, until),
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        call(storeIncludedEntities, response.included),
      );
    });

    it('throws an error on failure', () => {
      const errorMessage = 'an error message';
      const detailedMessage = 'detailed message';
      const count = 10;
      const until = undefined;
      const iterator = sagaFunctions.fetchCommitsForBranch(id, count, until);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Commits.LoadCommitsForBranch.REQUEST.actionCreator(id)),
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Commit.fetchForBranch, id, count, until),
      );

      expect(iterator.next({ error: errorMessage, details: detailedMessage }).value).to.deep.equal(
        put(Requests.actions.Commits.LoadCommitsForBranch.FAILURE.actionCreator(id, errorMessage, detailedMessage)),
      );

      const result = iterator.next();

      expect(result.value).to.equal(false);
      expect(result.done).to.equal(true);
    });
  });

  describe('ensureCommitRelatedDataLoaded', () => {
    it('makes sure commit exists for the Commit', () => {
      const id = '1';
      const iterator = sagaFunctions.ensureCommitRelatedDataLoaded(id);
      const commit: Commit = {
        id: 'id',
        hash: 'a',
        deployment: 'd1',
        message: '',
        author: {
          email: '',
          timestamp: 1,
        },
        committer: {
          email: '',
          timestamp: 1,
        },
      };

      expect(iterator.next().value).to.deep.equal(
        select(Commits.selectors.getCommit, id),
      );

      expect(iterator.next(commit).value).to.deep.equal(
        call(fetchIfMissing, 'deployments', 'd1'),
      );

      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('ensureCommitsForBranchRelatedDataLoaded', () => {
    it('ensures the associated deployments have been fetched', () => {
      const branchId = '1';

      const commits: Commit[] = [
        {
          id: 'c1',
          message: '',
          author: { email: '', timestamp: 1 },
          committer: { email: '', timestamp: 1 },
          hash: 'abc',
          deployment: 'foo1',
        },
        {
          id: 'c2',
          message: '',
          author: { email: '', timestamp: 1 },
          committer: { email: '', timestamp: 1 },
          hash: 'xyz',
        },
        {
          id: 'c3',
          message: '',
          author: { email: '', timestamp: 1 },
          committer: { email: '', timestamp: 1 },
          hash: 'cdsg',
          deployment: 'foo3',
        },
      ];

      const branch: Branch = {
        id: 'b',
        project: '1',
        buildErrors: [],
        name: 'branchname',
        commits: ['c1', 'c2', 'c3'],
        allCommitsLoaded: false,
        token: 'testtoken',
      };

      const iterator = sagaFunctions.ensureCommitsForBranchRelatedDataLoaded(branchId);
      expect(iterator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, branchId),
      );

      expect(iterator.next(branch).value).to.deep.equal(
        [
          call(fetchIfMissing, 'commits', branch.commits[0]),
          call(fetchIfMissing, 'commits', branch.commits[1]),
          call(fetchIfMissing, 'commits', branch.commits[2]),
        ],
      );

      expect(iterator.next(commits).value).to.deep.equal(
        [
          call(fetchIfMissing, 'deployments', commits[0].deployment),
          call(fetchIfMissing, 'deployments', commits[2].deployment),
        ],
      );

      expect(iterator.next().done).to.equal(true);
    });
  });
});
