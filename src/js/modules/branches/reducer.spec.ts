import { expect } from 'chai';
import { omit, values } from 'lodash';

import { Commit } from '../commits';
import { FetchError } from '../errors/index';
import Requests from '../requests';
import { CLEAR_STORED_DATA } from '../user';
import {
  addCommitsToBranch,
  removeBranch,
  storeBranches,
  updateBranchWithCommits,
  updateLatestActivityTimestampForBranch,
  updateLatestDeployedCommit,
} from './actions';
import reducer from './reducer';
import { Branch, BranchState } from './types';

describe('Branches reducer', () => {
  const newBranches: BranchState = {
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
      token: 'testtoken',
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
      token: 'testtoken',
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
      token: 'testtoken',
    },
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
      token: 'testtoken',
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
      token: 'testtoken',
    },
    1: {
      id: '1',
      name: 'first-branch-foo',
      latestSuccessfullyDeployedCommit: 'xyzabcdef',
      latestActivityTimestamp: 123,
      buildErrors: [],
      description: undefined,
      commits: ['1497539235'],
      allCommitsLoaded: false,
      project: '1',
      token: 'testtoken',
    },
  };

  it('returns the correct default empty state', () => {
    expect(reducer(undefined as any, { type: 'foobar' })).to.deep.equal({});
  });

  describe('storeBranches', () => {
    const storeAction = storeBranches(values<Branch>(newBranches));

    it('with an empty initial state', () => {
      expect(reducer(undefined as any, storeAction)).to.deep.equal(newBranches);
    });

    it('makes no changes with an empty list', () => {
      const emptyAction = { type: storeAction.type, entities: [] as any[] };
      const newState = reducer(stateWithoutExistingEntity, emptyAction);
      expect(newState).to.deep.equal(stateWithoutExistingEntity);
      expect(newState).to.equal(stateWithoutExistingEntity);
    });

    it('with other branches in state', () => {
      const newState = reducer(stateWithoutExistingEntity, storeAction);
      expect(newState).to.deep.equal({ ...stateWithoutExistingEntity, ...newBranches });
      expect(newState).to.not.equal(stateWithoutExistingEntity); // make sure not mutated
    });

    it('by replacing existing branches', () => {
      const newState = reducer(stateWithExistingEntity, storeAction);
      const expectedNewState = { ...stateWithExistingEntity, ...newBranches };
      expect(newState).to.deep.equal(expectedNewState);
      expect(newState).to.not.equal(stateWithExistingEntity); // make sure not mutated
    });
  });

  describe('failed fetch branch requests', () => {
    const failedRequestAction: FetchError = {
      id: '1',
      type: Requests.actions.Branches.LoadBranch.FAILURE.type,
      error: 'Error message in testing',
      details: 'Detailed message in testing',
      prettyError: 'Pretty error message in testing',
    };

    it('with an empty initial state', () => {
      expect(reducer(undefined as any, failedRequestAction)).to.deep.equal(
        { [failedRequestAction.id]: failedRequestAction },
      );
    });

    it('with other entities in state', () => {
      const newState = reducer(stateWithoutExistingEntity, failedRequestAction);
      expect(newState).to.deep.equal(
        { ...stateWithoutExistingEntity, [failedRequestAction.id]: failedRequestAction },
      );
      expect(newState).to.not.equal(stateWithoutExistingEntity); // make sure not mutated
    });

    it('by not overwriting existing entities', () => {
      const newState = reducer(stateWithExistingEntity, failedRequestAction);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity); // make sure not mutated
    });
  });

  describe('addCommitsToBranch', () => {
    it('to end of existing commits', () => {
      const addCommitsAction = addCommitsToBranch('1', ['12345678', '87654321'], 3);
      const newState = reducer(stateWithExistingEntity, addCommitsAction);
      const existingBranch = stateWithExistingEntity['1'] as Branch;
      expect(newState).to.deep.equal({
        ...stateWithExistingEntity,
        1: {
          ...existingBranch,
          commits: [...existingBranch.commits, ...addCommitsAction.commits],
          allCommitsLoaded: true,
        },
      });
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('to end of existing commits when only some are new', () => {
      const addCommitsAction = addCommitsToBranch('1', ['1497539235', '12345678', '87654321'], 4);
      const newState = reducer(stateWithExistingEntity, addCommitsAction);
      const existingBranch = stateWithExistingEntity['1'] as Branch;
      expect(newState).to.deep.equal({
        ...stateWithExistingEntity,
        1: {
          ...existingBranch,
          commits: [...existingBranch.commits, ...addCommitsAction.commits.slice(1)],
          allCommitsLoaded: true,
        },
      });
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('does nothing if commits already exist in the branch', () => {
      const addCommitsAction = addCommitsToBranch('1', ['1497539235'], 3);
      const newState = reducer(stateWithExistingEntity, addCommitsAction);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });

    it('does nothing if branch does not exist', () => {
      const addCommitsAction = addCommitsToBranch('doesntexist', ['12345678', '87654321'], 3);
      const newState = reducer(stateWithoutExistingEntity, addCommitsAction);
      expect(newState).to.deep.equal(stateWithoutExistingEntity);
      expect(newState).to.equal(stateWithoutExistingEntity);
    });
  });

  describe('removeBranch', () => {
    it('if it exists', () => {
      const removeBranchAction = removeBranch('1');
      const newState = reducer(stateWithExistingEntity, removeBranchAction);
      expect(newState).to.deep.equal(omit(stateWithExistingEntity, '1'));
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('does nothing if it doesn\'t exist', () => {
      const removeBranchAction = removeBranch('unexistant');
      const newState = reducer(stateWithExistingEntity, removeBranchAction);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });
  });

  describe('updateBranchWithCommits', () => {
    const commits: Commit[] = [
      {
        id: '01234567',
        hash: '01234567',
        author: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1469713881802,
        },
        committer: {
          name: undefined,
          email: 'juho@lucify.com',
          timestamp: 1469800281802,
        },
        message: 'Try to do something else',
        deployment: undefined,
        description: undefined,
      },
      {
        id: 'a998823423',
        hash: 'a998823423',
        author: {
          name: undefined,
          email: 'juho@lucify.com',
          timestamp: 1469634681802,
        },
        committer: {
          name: undefined,
          email: 'juho@lucify.com',
          timestamp: 1469634681802,
        },
        message: 'Try to do something',
        deployment: '8',
        description: 'This is a longer commit explanation for whatever was done to the commit. ' +
          'It should be truncated in some cases',
      },
    ];

    it('updates the latest deployed commit of the branch', () => {
      const action = updateBranchWithCommits('5', '01234567', commits, ['125124235']);
      const newState = reducer(stateWithExistingEntity, action);
      const newBranch = newState['5'] as Branch;
      expect(newBranch.latestCommit).to.equal(action.latestCommitId);
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('adds the commits to the beginnig if they are the newest', () => {
      const action = updateBranchWithCommits('5', '01234567', commits, ['125124235']);
      const newState = reducer(stateWithExistingEntity, action);
      const oldBranch = stateWithExistingEntity['5'] as Branch;
      expect(newState).to.deep.equal({
        ...stateWithExistingEntity,
        5: {
          ...oldBranch,
          latestCommit: action.latestCommitId,
          commits: [...action.newCommits.map(commit => commit.id), ...oldBranch.commits],
        },
      });
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('replaces some commits if there was a force push and only some commits were changed', () => {
      const action = updateBranchWithCommits('5', '01234567', commits, ['566342463']);
      const newState = reducer(stateWithExistingEntity, action);
      const oldBranch = stateWithExistingEntity['5'] as Branch;
      expect(newState).to.deep.equal({
        ...stateWithExistingEntity,
        5: {
          ...oldBranch,
          latestCommit: action.latestCommitId,
          commits: [...action.newCommits.map(commit => commit.id), ...oldBranch.commits.slice(1)],
        },
      });
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('replaces all existing commits if the parent commit ID can\'t be found', () => {
      const action = updateBranchWithCommits('5', '01234567', commits, ['noexist']);
      const newState = reducer(stateWithExistingEntity, action);
      const oldBranch = stateWithExistingEntity['5'] as Branch;
      expect(newState).to.deep.equal({
        ...stateWithExistingEntity,
        5: {
          ...oldBranch,
          latestCommit: action.latestCommitId,
          commits: [...action.newCommits.map(commit => commit.id)],
        },
      });
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('replaces all existing commits if there is no parent commit ID', () => {
      const action = updateBranchWithCommits('5', '01234567', commits, []);
      const newState = reducer(stateWithExistingEntity, action);
      const oldBranch = stateWithExistingEntity['5'] as Branch;
      expect(newState).to.deep.equal({
        ...stateWithExistingEntity,
        5: {
          ...oldBranch,
          latestCommit: action.latestCommitId,
          commits: [...action.newCommits.map(commit => commit.id)],
        },
      });
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('does nothing if the commits are for a branch that doesn\'t exist', () => {
      const action = updateBranchWithCommits('noexist', '01234567', commits, ['566342463']);
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });
  });

  describe('updateLatestActivityTimestampForBranch', () => {
    it('updates an existing branch', () => {
      const action = updateLatestActivityTimestampForBranch('1', 13579);
      const newState = reducer(stateWithExistingEntity, action);
      const newBranch = newState['1'] as Branch;
      expect(newBranch.latestActivityTimestamp).to.equal(action.timestamp);
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('does nothing if the timestamp is the same', () => {
      const action = updateLatestActivityTimestampForBranch('1', 123);
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });

    it('does nothing if the branch doesn\'t exist', () => {
      const action = updateLatestActivityTimestampForBranch('notexist', 13579);
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });
  });

  describe('updateLatestDeployedCommit', () => {
    it('updates an existing branch', () => {
      const action = updateLatestDeployedCommit('1', 'abcedfsddd');
      const newState = reducer(stateWithExistingEntity, action);
      const newBranch = newState['1'] as Branch;
      expect(newBranch.latestSuccessfullyDeployedCommit).to.equal(action.commit);
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('does nothing if the commit is the same', () => {
      const action = updateLatestDeployedCommit('1', 'xyzabcdef');
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });

    it('does nothing if the branch doesn\'t exist', () => {
      const action = updateLatestDeployedCommit('notexist', 'abcedfsddd');
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });
  });

  it(`clears data on ${CLEAR_STORED_DATA}`, () => {
    expect(reducer(stateWithExistingEntity, { type: CLEAR_STORED_DATA })).to.deep.equal({});
    expect(reducer(stateWithoutExistingEntity, { type: CLEAR_STORED_DATA })).to.deep.equal({});
    expect(reducer(undefined as any, { type: CLEAR_STORED_DATA })).to.deep.equal({});
  });
});
