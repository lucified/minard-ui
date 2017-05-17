import { expect } from 'chai';

/*import { FetchError } from '../errors';
import Requests from '../requests';
import { STORE_COMMITS } from './actions';*/
import reducer from './reducer';
// import { CommitState } from './types';

describe('Commits reducer', () => {
  /*
  const expectedObjectsToStore: CommitState = {
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

  const storeAction = {
    type: STORE_COMMITS,
    entities: expectedObjectsToStore,
  };

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
    098325343: {
      id: '098325343',
      hash: '0123456789abcdecccf',
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

  const failedRequestObject: FetchError = {
    id: '2543452',
    type: Requests.actions.Commits.LoadCommit.FAILURE.type,
    error: 'Error message in testing',
    details: 'Detailed message in testing',
    prettyError: 'Pretty error message in testing',
  };

  testReducer(
    reducer,
    storeAction,
    expectedObjectsToStore,
    stateWithoutExistingEntity,
    stateWithExistingEntity,
    failedRequestObject,
  );*/

  it('returns the correct default state', () => {
    expect(reducer(undefined as any, { type: 'foobar' })).to.deep.equal({});
  });

  describe('adding a deployment to a commit', () => {
    it('TODO');
  });
});
