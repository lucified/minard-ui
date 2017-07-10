import { expect } from 'chai';
import { values } from 'lodash';

import { DeploymentStatus } from '../deployments';
import { CLEAR_STORED_DATA } from '../user/index';
import { storeActivities } from './actions';
import reducer from './reducer';
import { ActivityState, ActivityType, StoreActivitiesAction } from './types';

describe('Activities reducer', () => {
  const newActivities: ActivityState = {
    1: {
      id: '1',
      timestamp: 1470131481802,
      type: ActivityType.Deployment,
      project: {
        id: '1',
        name: 'first-project',
      },
      branch: {
        id: '1',
        name: 'first-branch',
      },
      commit: {
        id: 'aacceeff02',
        author: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470066681802,
        },
        hash: '0123456789abcdef',
        committer: {
          name: undefined,
          email: 'juho@lucify.com',
          timestamp: 1469800281802,
        },
        message:
          "Fix colors\n\nThe previous colors didn't look nice. Now they're much prettier.",
        deployment: '7',
      },
      deployment: {
        id: '7',
        url: '#',
        screenshot:
          'https://www.lucify.com/images/lucify-asylum-countries-open-graph-size-5adef1be36.png',
        status: DeploymentStatus.Success,
        creator: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470131481802,
        },
        token: 'testtoken',
      },
    },
    2: {
      id: '2',
      type: ActivityType.Deployment,
      timestamp: 1470045081802,
      project: {
        id: '1',
        name: 'first-project',
      },
      branch: {
        id: '2',
        name: 'second-branch',
      },
      commit: {
        id: 'a998823423',
        author: {
          name: undefined,
          email: 'juho@lucify.com',
          timestamp: 1469634681802,
        },
        hash: '0123456789abcdef',
        committer: {
          name: undefined,
          email: 'juho@lucify.com',
          timestamp: 1469634681802,
        },
        message:
          'Try to do something\n\nThis is a longer commit explanation for whatever was done to the commit. ' +
          'It should be truncated in some cases',
        deployment: '8',
      },
      deployment: {
        id: '8',
        url: '#',
        screenshot:
          'https://www.lucify.com/images/lucify-asylum-countries-open-graph-size-5adef1be36.png',
        status: DeploymentStatus.Success,
        creator: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470045081802,
        },
        token: 'testtoken',
      },
    },
  };

  const stateWithoutExistingEntity: ActivityState = {
    3: {
      id: '3',
      type: ActivityType.Deployment,
      timestamp: 1470145081802,
      project: {
        id: '1',
        name: 'first-project',
      },
      branch: {
        id: '2',
        name: 'second-branch',
      },
      commit: {
        id: '12345623',
        author: {
          name: undefined,
          email: 'juho@lucify.com',
          timestamp: 1469634681802,
        },
        hash: '532625434',
        committer: {
          name: undefined,
          email: 'juho@lucify.com',
          timestamp: 1469634681802,
        },
        message: 'foobar',
        deployment: '9',
      },
      deployment: {
        id: '9',
        url: '#',
        screenshot:
          'https://www.lucify.com/images/lucify-asylum-countries-open-graph-size-5adef1be36.png',
        status: DeploymentStatus.Success,
        creator: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470145081802,
        },
        token: 'testtoken',
      },
    },
  };

  const stateWithExistingEntity: ActivityState = {
    1: {
      id: '1',
      timestamp: 1471131481802,
      type: ActivityType.Deployment,
      project: {
        id: '1',
        name: 'first-project',
      },
      branch: {
        id: '1',
        name: 'first-branch',
      },
      commit: {
        id: 'aacceeff02',
        author: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470066681802,
        },
        hash: '0123456789abcdef',
        committer: {
          email: 'juho@lucify.com',
          timestamp: 1469800281802,
        },
        message: 'Is this replaced?',
        deployment: '6',
      },
      deployment: {
        id: '6',
        url: '#',
        screenshot:
          'https://www.lucify.com/images/lucify-asylum-countries-open-graph-size-5adef1be36.png',
        status: DeploymentStatus.Success,
        creator: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1471131481802,
        },
        token: 'testtoken',
      },
    },
    3: {
      id: '3',
      type: ActivityType.Deployment,
      timestamp: 1470145081802,
      project: {
        id: '1',
        name: 'first-project',
      },
      branch: {
        id: '2',
        name: 'second-branch',
      },
      commit: {
        id: '12345623',
        author: {
          email: 'juho@lucify.com',
          timestamp: 1469634681802,
        },
        hash: '532625434',
        committer: {
          email: 'juho@lucify.com',
          timestamp: 1469634681802,
        },
        message: 'foobar',
        deployment: '9',
      },
      deployment: {
        id: '9',
        url: '#',
        screenshot:
          'https://www.lucify.com/images/lucify-asylum-countries-open-graph-size-5adef1be36.png',
        status: DeploymentStatus.Success,
        creator: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470145081802,
        },
        token: 'testtoken',
      },
    },
  };

  it('returns the correct default empty state', () => {
    expect(reducer(undefined as any, { type: 'foobar' })).to.deep.equal({});
  });

  describe('stores activities', () => {
    const storeAction = storeActivities(values(newActivities));

    it('with an empty initial state', () => {
      expect(reducer(undefined as any, storeAction)).to.deep.equal(
        newActivities,
      );
    });

    it('makes no changes with an empty list', () => {
      const emptyAction: StoreActivitiesAction = {
        type: storeAction.type,
        entities: [],
      };
      const newState = reducer(stateWithoutExistingEntity, emptyAction);
      expect(newState).to.deep.equal(stateWithoutExistingEntity);
      expect(newState).to.equal(stateWithoutExistingEntity);
    });

    it('with other entities in state', () => {
      const newState = reducer(stateWithoutExistingEntity, storeAction);
      expect(newState).to.deep.equal({
        ...stateWithoutExistingEntity,
        ...newActivities,
      });
      expect(newState).to.not.equal(stateWithoutExistingEntity); // make sure not mutated
    });

    it('with existing entities in state', () => {
      const newState = reducer(stateWithExistingEntity, storeAction);
      expect(newState).to.deep.equal({
        ...stateWithExistingEntity,
        ...newActivities,
      });
      expect(newState).to.not.equal(stateWithExistingEntity); // make sure not mutated
    });
  });

  it(`clears data on ${CLEAR_STORED_DATA}`, () => {
    expect(
      reducer(stateWithExistingEntity, { type: CLEAR_STORED_DATA }),
    ).to.deep.equal({});
    expect(
      reducer(stateWithoutExistingEntity, { type: CLEAR_STORED_DATA }),
    ).to.deep.equal({});
    expect(
      reducer(undefined as any, { type: CLEAR_STORED_DATA }),
    ).to.deep.equal({});
  });
});
