import { expect } from 'chai';
import { values } from 'lodash';

import { FetchError } from '../errors/index';
import Requests from '../requests';
import { CLEAR_STORED_DATA } from '../user';
import {
  addDeploymentToCommit,
  storeCommits,
} from './actions';
import reducer from './reducer';
import { Commit, CommitState } from './types';

describe.only('Commits reducer', () => {
  const stateWithoutExistingEntity: CommitState = {
    098325343: {
      id: '098325343',
      hash: '0123456789abcdef',
      author: {
        name: 'Ville Saarinen',
        email: 'ville.saarinen@lucify.com',
        timestamp: 1470055881801,
      },
      committer: {
        name: 'Ville Saarinen',
        email: 'ville.saarinen@lucify.com',
        timestamp: 1470055881801,
      },
      message: 'This is a commit message',
      deployment: undefined,
      description: undefined,
    },
  };

  const stateWithExistingEntity: CommitState = {
    '098325343': {
      id: '098325343',
      hash: '098325343',
      author: {
        name: 'Ville Saarinen',
        email: 'ville.saarinen@lucify.com',
        timestamp: 1470055881801,
      },
      committer: {
        name: 'Ville Saarinen',
        email: 'ville.saarinen@lucify.com',
        timestamp: 1470055881801,
      },
      message: 'This is a commit message',
      deployment: 'existingDep',
      description: undefined,
    },
    2543452: {
      id: '2543452',
      hash: '1235232141',
      author: {
        name: undefined,
        email: 'juho@lucify.com',
        timestamp: 1470055881812,
      },
      committer: {
        name: undefined,
        email: 'juho@lucify.com',
        timestamp: 1470055881812,
      },
      message: 'Barbar barearr',
      deployment: undefined,
      description: undefined,
    },
  };

  it('returns the correct default state', () => {
    expect(reducer(undefined as any, { type: 'foobar' })).to.deep.equal({});
  });

  describe('storeCommits', () => {
    const newCommits: CommitState = {
      '01234567': {
        id: '01234567',
        hash: '0123456789abcdef',
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
      a998823423: {
        id: 'a998823423',
        hash: '0123456789abcdef',
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
    };
    const storeAction = storeCommits(values<Commit>(newCommits));

    it('with an empty initial state', () => {
      expect(reducer(undefined as any, storeAction)).to.deep.equal(newCommits);
    });

    it('makes no changes with an empty list', () => {
      const emptyAction = storeCommits([]);
      const newState = reducer(stateWithoutExistingEntity, emptyAction);
      expect(newState).to.deep.equal(stateWithoutExistingEntity);
      expect(newState).to.equal(stateWithoutExistingEntity);
    });

    it('with other commits in state', () => {
      const newState = reducer(stateWithoutExistingEntity, storeAction);
      expect(newState).to.deep.equal({ ...stateWithoutExistingEntity, ...newCommits});
      expect(newState).to.not.equal(stateWithoutExistingEntity); // make sure not mutated
    });

    it('by replacing existing commits', () => {
      const newState = reducer(stateWithExistingEntity, storeAction);
      const expectedNewState = { ...stateWithExistingEntity, ...newCommits };
      expect(newState).to.deep.equal(expectedNewState);
      expect(newState).to.not.equal(stateWithExistingEntity); // make sure not mutated
    });
  });

  describe('failed fetch commit requests', () => {
    const failedRequestAction: FetchError = {
      id: '2543452',
      type: Requests.actions.Commits.LoadCommit.FAILURE.type,
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

  describe('addDeploymentToCommit', () => {
    it('should add a deployment to a commit that doesn\'t have any', () => {
      const action = addDeploymentToCommit('2543452', 'dep1');
      const newState = reducer(stateWithExistingEntity, action);
      const newCommit = newState['2543452'] as Commit;
      expect(newCommit.deployment).to.equal(action.deployment);
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('should update a deployment to a commit that already has one', () => {
      const action = addDeploymentToCommit('098325343', 'dep1');
      const newState = reducer(stateWithExistingEntity, action);
      const newCommit = newState['098325343'] as Commit;
      expect(newCommit.deployment).to.equal(action.deployment);
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('should do nothing if the deployment already exists in the commit', () => {
      const action = addDeploymentToCommit('098325343', 'existingDep');
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });

    it('should do nothing if the commit does not exist', () => {
      const action = addDeploymentToCommit('notExist', 'dep1');
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
