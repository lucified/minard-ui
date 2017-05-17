// import { expect } from 'chai';

import { } from './actions';
// import reducer from './reducer';
import {  } from './types';

describe('Activities reducer', () => {
  /*const { reducer } = Activities;

  const successfulActivitiesRequestAction = {
    type: Requests.actions.Activities.LoadAllActivities.SUCCESS.type,
    response: testData.activitiesResponse.data,
  };

  const successfulActivitiesForProjectRequestAction = {
    type: Requests.actions.Activities.LoadActivitiesForProject.SUCCESS.type,
    response: testData.activitiesResponse.data,
  };

  const expectedObjectsToStore: ActivityState = {
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
        message: "Fix colors\n\nThe previous colors didn't look nice. Now they're much prettier.",
        deployment: '7',
      },
      deployment: {
        id: '7',
        url: '#',
        screenshot: 'https://www.lucify.com/images/lucify-asylum-countries-open-graph-size-5adef1be36.png',
        status: DeploymentStatus.Success,
        creator: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470131481802,
        },
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
        message: 'Try to do something\n\nThis is a longer commit explanation for whatever was done to the commit. ' +
          'It should be truncated in some cases',
        deployment: '8',
      },
      deployment: {
        id: '8',
        url: '#',
        screenshot: 'https://www.lucify.com/images/lucify-asylum-countries-open-graph-size-5adef1be36.png',
        status: DeploymentStatus.Success,
        creator: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470045081802,
        },
      },
    },
  };

  const storeAction = {
    type: Activities.actions.STORE_ACTIVITIES,
    entities: expectedObjectsToStore,
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
        screenshot: 'https://www.lucify.com/images/lucify-asylum-countries-open-graph-size-5adef1be36.png',
        status: DeploymentStatus.Success,
        creator: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470145081802,
        },
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
        screenshot: 'https://www.lucify.com/images/lucify-asylum-countries-open-graph-size-5adef1be36.png',
        status: DeploymentStatus.Success,
        creator: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1471131481802,
        },
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
        screenshot: 'https://www.lucify.com/images/lucify-asylum-countries-open-graph-size-5adef1be36.png',
        status: DeploymentStatus.Success,
        creator: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470145081802,
        },
      },
    },
  };

  const expectedStateWithoutExistingEntity = Object.assign({}, stateWithoutExistingEntity, expectedObjectsToStore);
  const expectedStateWithExistingEntity = Object.assign({}, stateWithExistingEntity, expectedObjectsToStore);

  testStoreEntities(
    reducer,
    storeAction,
    expectedObjectsToStore,
    stateWithoutExistingEntity,
    expectedStateWithoutExistingEntity,
    stateWithExistingEntity,
    expectedStateWithExistingEntity
  );

  describe(`successful request all activities (${successfulActivitiesRequestAction.type})`, () => {
    it('with an empty initial state', () => {
      expect(reducer(<any> undefined, successfulActivitiesRequestAction)).to.deep.equal(expectedObjectsToStore);
    });

    it('makes no changes with an empty list', () => {
      const emptyAction = { type: successfulActivitiesRequestAction.type, entities: <any[]> [] };
      const newState = reducer(stateWithoutExistingEntity, emptyAction);
      expect(newState).to.deep.equal(stateWithoutExistingEntity);
      expect(newState).to.equal(stateWithoutExistingEntity);
    });

    it('with other entities in state', () => {
      const newState = reducer(stateWithoutExistingEntity, successfulActivitiesRequestAction);
      expect(newState).to.deep.equal(expectedStateWithoutExistingEntity);
      expect(newState).to.not.equal(stateWithoutExistingEntity); // make sure not mutated
    });

    it('by overwriting existing entities', () => {
      const newState = reducer(stateWithExistingEntity, successfulActivitiesRequestAction);
      expect(newState).to.deep.equal(expectedStateWithExistingEntity);
      expect(newState).to.not.equal(stateWithExistingEntity); // make sure not mutated
    });
  });

  describe(`successful request activities for project (${successfulActivitiesForProjectRequestAction.type})`, () => {
    it('with an empty initial state', () => {
      expect(reducer(<any> undefined, successfulActivitiesForProjectRequestAction)).to.deep.equal(
        expectedObjectsToStore
      );
    });

    it('makes no changes with an empty list', () => {
      const emptyAction = { type: successfulActivitiesForProjectRequestAction.type, entities: <any[]> [] };
      const newState = reducer(stateWithoutExistingEntity, emptyAction);
      expect(newState).to.deep.equal(stateWithoutExistingEntity);
      expect(newState).to.equal(stateWithoutExistingEntity);
    });

    it('with other entities in state', () => {
      const newState = reducer(stateWithoutExistingEntity, successfulActivitiesForProjectRequestAction);
      expect(newState).to.deep.equal(expectedStateWithoutExistingEntity);
      expect(newState).to.not.equal(stateWithoutExistingEntity); // make sure not mutated
    });

    it('by overwriting existing entities', () => {
      const newState = reducer(stateWithExistingEntity, successfulActivitiesForProjectRequestAction);
      expect(newState).to.deep.equal(expectedStateWithExistingEntity);
      expect(newState).to.not.equal(stateWithExistingEntity); // make sure not mutated
    });
  });
  */
});
