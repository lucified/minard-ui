// tslint:disable:no-object-literal-type-assertion

import { expect } from 'chai';
import { call, fork, put, select, take } from 'redux-saga/effects';

import { toBranches } from '../../api/convert';
import Branches, { Branch } from '../branches';
import { Commit } from '../commits';
import Projects from '../projects';
import Requests from '../requests';
import { LoadBranchesForProjectAction } from './index';

import { createApi, testData, testEntityFetcher, testLoader } from '../../sagas/test-utils';
import { fetchIfMissing, storeIncludedEntities } from '../../sagas/utils';
import createSagas from './sagas';

describe('Branches sagas', () => {
  const api = createApi();
  const sagaFunctions = createSagas(api).functions;

  testLoader(
    'loadBranch',
    sagaFunctions.loadBranch,
    Branches.selectors.getBranch,
    sagaFunctions.fetchBranch,
    sagaFunctions.ensureBranchRelatedDataLoaded,
  );

  describe('loadBranchesForProject', () => {
    const action: LoadBranchesForProjectAction = {
      type: Branches.actions.LOAD_BRANCHES_FOR_PROJECT,
      id: '1',
    };

    it('calls fetchBranchesForProject if branch exists', () => {
      const iterator = sagaFunctions.loadBranchesForProject(action);

      expect(iterator.next().value).to.deep.equal(
        select(Projects.selectors.getProject, action.id),
      );

      expect(iterator.next({ id: action.id }).value).to.deep.equal(
        call(sagaFunctions.fetchBranchesForProject, action.id),
      );
    });

    it('calls fetchBranchesForProject only once branch has been received', () => {
      const iterator = sagaFunctions.loadBranchesForProject(action);

      expect(iterator.next().value).to.deep.equal(
        select(Projects.selectors.getProject, action.id),
      );

      expect(iterator.next().value).to.deep.equal(
        take(Projects.actions.STORE_PROJECTS),
      );

      expect(iterator.next({ entities: [{ id: 'foo' }]}).value).to.deep.equal(
        take(Projects.actions.STORE_PROJECTS),
      );

      expect(iterator.next({ entities: [{ id: 'bar' }, { id: action.id }]}).value).to.deep.equal(
        call(sagaFunctions.fetchBranchesForProject, action.id),
      );
    });

    it('ensures needed data exists if fetch was a success', () => {
      const iterator = sagaFunctions.loadBranchesForProject(action);

      iterator.next();
      iterator.next({ id: action.id });
      expect(iterator.next(true).value).to.deep.equal(
        fork(sagaFunctions.ensureBranchesForProjectRelatedDataLoaded, action.id),
      );
      expect(iterator.next().done).to.equal(true);
    });

    it('does not ensure needed data if fetch was a failure', () => {
      const iterator = sagaFunctions.loadBranchesForProject(action);

      iterator.next();
      iterator.next({ id: action.id });
      expect(iterator.next(false).done).to.equal(true);
    });
  });

  testEntityFetcher(
    'fetchBranch',
    testData.branchResponse,
    { data: testData.branchResponse.data },
    Requests.actions.Branches.LoadBranch,
    sagaFunctions.fetchBranch,
    api.Branch.fetch,
    toBranches,
    Branches.actions.storeBranches,
  );

  describe('fetchBranchesForProject', () => {
    const id = 'id';

    it('fetches, converts and stores branches', () => {
      const response = { data: testData.projectBranchesResponse.data };
      const iterator = sagaFunctions.fetchBranchesForProject(id);
      const objects = [{ id: '1' }, { id: '2' }, { id: '3' }];

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Branches.LoadBranchesForProject.REQUEST.actionCreator(id)),
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Branch.fetchForProject, id),
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        call(toBranches, response.data),
      );

      expect(iterator.next(objects).value).to.deep.equal(
        put(Branches.actions.storeBranches(objects as any)),
      );

      expect(iterator.next().value).to.deep.equal(
        put(Projects.actions.addBranchesToProject(id, ['1', '2', '3'])),
      );

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Branches.LoadBranchesForProject.SUCCESS.actionCreator(id)),
      );

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('fetches and stores included data', () => {
      const response = testData.projectBranchesResponse;
      const iterator = sagaFunctions.fetchBranchesForProject(id);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Branches.LoadBranchesForProject.REQUEST.actionCreator(id)),
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Branch.fetchForProject, id),
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        call(storeIncludedEntities, response.included),
      );
    });

    it('throws an error on failure', () => {
      const errorMessage = 'an error message';
      const iterator = sagaFunctions.fetchBranchesForProject(id);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Branches.LoadBranchesForProject.REQUEST.actionCreator(id)),
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Branch.fetchForProject, id),
      );

      expect(iterator.next({ error: errorMessage }).value).to.deep.equal(
        put(Requests.actions.Branches.LoadBranchesForProject.FAILURE.actionCreator(id, errorMessage)),
      );

      const result = iterator.next();

      expect(result.value).to.equal(false);
      expect(result.done).to.equal(true);
    });
  });

  describe('ensureBranchRelatedDataLoaded', () => {
    it('makes sure commits and deployments exist for the branch', () => {
      const id = '1';
      const iterator = sagaFunctions.ensureBranchRelatedDataLoaded(id);
      const branch: Branch = {
        id: 'a',
        name: 'brancha',
        latestCommit: 'lc',
        latestSuccessfullyDeployedCommit: 'lsdc',
        buildErrors: [],
        project: '1',
        commits: ['lc', 'lsdc'],
        allCommitsLoaded: false,
        token: 'foobartoken',
      };
      const latestSuccessfullyDeployedCommit: Commit = {
        id: 'abc',
        message: '',
        author: { email: '', timestamp: 1 },
        committer: { email: '', timestamp: 1 },
        hash: 'abc',
        deployment: 'foo',
      };

      expect(iterator.next().value).to.deep.equal(
        select(Branches.selectors.getBranch, id),
      );

      expect(iterator.next(branch).value).to.deep.equal(
        call(fetchIfMissing, 'projects', '1'),
      );

      expect(iterator.next().value).to.deep.equal(
        call(fetchIfMissing, 'commits', branch.latestSuccessfullyDeployedCommit),
      );

      expect(iterator.next(latestSuccessfullyDeployedCommit).value).to.deep.equal(
        call(fetchIfMissing, 'deployments', latestSuccessfullyDeployedCommit.deployment),
      );

      expect(iterator.next().value).to.deep.equal(
        call(fetchIfMissing, 'commits', branch.latestCommit),
      );

      expect(iterator.next().done).to.equal(true);
    });
  });

  describe('ensureBranchesForProjectRelatedDataLoaded', () => {
    it('fetches the latest commits and deployment for each branch', () => {
      const projectId = '1';
      const branches: Branch[] = [
        {
          id: 'b1',
          latestSuccessfullyDeployedCommit: 'b1sc',
          project: projectId,
          buildErrors: [],
          name: 'branch-1',
          latestCommit: 'b1lc',
          commits: ['b1lc', 'b1sc'],
          allCommitsLoaded: false,
          token: 'foobartoken',
        },
        {
          id: 'b2',
          latestSuccessfullyDeployedCommit: 'b2sc',
          project: projectId,
          buildErrors: [],
          name: 'branch-2',
          latestCommit: 'b2sc',
          commits: ['b2sc'],
          allCommitsLoaded: false,
          token: 'foobartoken',
        },
        {
          id: 'b3',
          project: projectId,
          buildErrors: [],
          name: 'branch-3',
          commits: [],
          allCommitsLoaded: true,
          token: 'foobartoken',
        },
      ];
      const deployedCommits: Commit[] = [
        {
          id: 'b1sc',
          message: '',
          author: { email: '', timestamp: 1 },
          committer: { email: '', timestamp: 1 },
          hash: 'abc',
          deployment: 'foo1',
        },
        {
          id: 'b2sc',
          message: '',
          author: { email: '', timestamp: 1 },
          committer: { email: '', timestamp: 1 },
          hash: 'xyz',
          deployment: 'foo2',
        },
      ];

      const iterator = sagaFunctions.ensureBranchesForProjectRelatedDataLoaded(projectId);
      expect(iterator.next().value).to.deep.equal(
        select(Branches.selectors.getBranchesForProject, projectId),
      );

      expect(iterator.next(branches).value).to.deep.equal(
        [
          call(fetchIfMissing, 'commits', branches[0].latestSuccessfullyDeployedCommit),
          call(fetchIfMissing, 'commits', branches[1].latestSuccessfullyDeployedCommit),
        ],
      );

      expect(iterator.next(deployedCommits).value).to.deep.equal(
        [
          call(fetchIfMissing, 'deployments', deployedCommits[0].deployment),
          call(fetchIfMissing, 'deployments', deployedCommits[1].deployment),
        ],
      );

      expect(iterator.next().value).to.deep.equal(
        [
          call(fetchIfMissing, 'commits', branches[0].latestCommit),
          call(fetchIfMissing, 'commits', branches[1].latestCommit),
        ],
      );

      expect(iterator.next().done).to.equal(true);
    });
  });
});
