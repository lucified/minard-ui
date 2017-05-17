// import { expect } from 'chai';

import { } from './actions';
// import reducer from './reducer';
import {  } from './types';

describe('Branches reducer', () => {
  /* TODO: fix
  const { reducer } = Branches;

  const expectedObjectsToStore: BranchState = {
    1: {
      id: '1',
      name: 'first-branch',
      description: 'This is a branch description',
      latestSuccessfullyDeployedCommit: 'aacceeff02',
      latestCommit: 'aacceeff02',
      latestActivityTimestamp: 1470066681802,
      buildErrors: [],
      commits: ['aacceeff02'],
      allCommitsLoaded: false,
      project: '1',
    },
    2: {
      id: '2',
      name: 'second-branch',
      description: undefined,
      latestSuccessfullyDeployedCommit: 'a998823423',
      latestCommit: '01234567',
      latestActivityTimestamp: 1469634681802,
      buildErrors: [],
      commits: ['01234567', 'a998823423'],
      allCommitsLoaded: false,
      project: '1',
    },
    3: {
      id: '3',
      description: undefined,
      latestSuccessfullyDeployedCommit: undefined,
      latestCommit: undefined,
      latestActivityTimestamp: undefined,
      buildErrors: [],
      name: 'third-long-name-branch',
      commits: [],
      allCommitsLoaded: true,
      project: '1',
    },
  };

  const storeAction = {
    type: Branches.actions.STORE_BRANCHES,
    entities: expectedObjectsToStore,
  };

  const stateWithoutExistingEntity: BranchState = {
    4: {
      id: '4',
      name: 'fourth-branch',
      buildErrors: [],
      description: undefined,
      commits: ['aacd00f03', 'a998833433'],
      allCommitsLoaded: false,
      project: '1',
    },
  };

  const stateWithExistingEntity: BranchState = {
    5: {
      id: '5',
      name: 'fifth-branch-foo',
      buildErrors: [],
      description: undefined,
      commits: ['125124235', '566342463'],
      allCommitsLoaded: false,
      project: '1',
    },
    1: {
      id: '1',
      name: 'first-branch-foo',
      buildErrors: [],
      description: undefined,
      commits: ['1497539235'],
      allCommitsLoaded: false,
      project: '1',
    },
  };

  const failedRequestAction: FetchError = {
    id: '1',
    type: Requests.actions.Branches.LoadBranch.FAILURE.type,
    error: 'Error message in testing',
    details: 'Detailed message in testing',
    prettyError: 'Pretty error message in testing',
  };

  // Start actual tests
  testInitialState(reducer, {});

  let expectedStateFromEmpty = expectedObjectsToStore;
  let expectedStateWithoutExistingEntity = Object.assign({}, stateWithoutExistingEntity, expectedObjectsToStore);
  let expectedStateWithExistingEntity: BranchState = {
    1: Object.assign({}, expectedObjectsToStore['1'],
      // Merge the commits from the existing one
      { commits: (<any> expectedObjectsToStore['1']).commits.concat((<any> stateWithExistingEntity['1']).commits) }
    ),
    2: expectedObjectsToStore['2'],
    3: expectedObjectsToStore['3'],
    5: stateWithExistingEntity['5'],
  };

  testStoreEntities(
    reducer,
    storeAction,
    expectedStateFromEmpty,
    stateWithoutExistingEntity,
    expectedStateWithoutExistingEntity,
    stateWithExistingEntity,
    expectedStateWithExistingEntity,
  );

  expectedStateFromEmpty = { [failedRequestAction.id]: failedRequestAction };
  expectedStateWithoutExistingEntity = Object.assign({}, stateWithoutExistingEntity, expectedStateFromEmpty);

  testFailedRequest(
    reducer,
    failedRequestAction,
    expectedStateFromEmpty,
    stateWithoutExistingEntity,
    expectedStateWithoutExistingEntity,
    stateWithExistingEntity,
  );*/

  describe('store commits to branch', () => {
    it('TODO');
  });

  describe('remove branch', () => {
    it('TODO');
  });
});
