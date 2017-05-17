import { expect } from 'chai';

import Requests from '../requests';
// import { STORE_PROJECTS } from './actions';
import reducer from './reducer';
import { ProjectState } from './types';

describe('Projects reducer', () => {
  const expectedObjectsToStore: ProjectState = {
    1: {
      id: '1',
      name: 'first-project',
      description: 'This is the first-project description. It might not be set.',
      branches: undefined,
      latestActivityTimestamp: 1470066681802,
      latestSuccessfullyDeployedCommit: 'aacceeff02',
      activeUsers: [
        {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
        },
        {
          email: 'juho@lucify.com',
          name: undefined,
        },
      ],
      repoUrl: 'http://mock.repo.url/project.git',
      token: 'foobartoken',
    },
    2: {
      id: '2',
      name: 'second-project',
      description: undefined,
      branches: undefined,
      latestActivityTimestamp: undefined,
      latestSuccessfullyDeployedCommit: undefined,
      activeUsers: [],
      repoUrl: 'http://mock.repo.url/project.git',
      token: 'foobartoken',
    },
  };
  /*
  const storeAction = {
    type: STORE_PROJECTS,
    entities: expectedObjectsToStore,
  };

  const stateWithoutExistingEntity: ProjectState = {
    3: {
      id: '3',
      name: 'Third project',
      description: undefined,
      activeUsers: [],
      latestActivityTimestamp: undefined,
      latestSuccessfullyDeployedCommit: undefined,
      branches: undefined,
      repoUrl: 'http://mock.repo.url/project.git',
      token: 'foobartoken',
    },
  };*/

  const stateWithExistingEntity: ProjectState = {
    3: {
      id: '3',
      name: 'Third project a',
      description: undefined,
      branches: undefined,
      latestActivityTimestamp: undefined,
      latestSuccessfullyDeployedCommit: undefined,
      activeUsers: [
        {
          email: 'foo@bar.com',
        },
      ],
      repoUrl: 'http://mock.repo.url/project.git',
      token: 'foobartoken',
    },
    1: {
      id: '1',
      name: 'first-project again',
      description: 'foobar',
      branches: undefined,
      latestActivityTimestamp: undefined,
      latestSuccessfullyDeployedCommit: undefined,
      activeUsers: [
        {
          email: 'foo@bar.com',
        },
      ],
      repoUrl: 'http://mock.repo.url/project.git',
      token: 'foobartoken',
    },
  };
  /*
  const failedRequestObject: FetchError = {
    id: '1',
    type: Requests.actions.Projects.LoadProject.FAILURE.type,
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

  const allProjectsObjects = expectedObjectsToStore;
  const expectedStateWithExistingEntity = Object.assign({}, stateWithExistingEntity, allProjectsObjects);

  describe('project deletion', () => {
    it(`removes a project from the state upon receiving ${Requests.actions.Projects.DeleteProject.SUCCESS.type}`,
      () => {
        const action = {
          type: Requests.actions.Projects.DeleteProject.SUCCESS.type,
          id: 3,
        };
        const initialState = expectedStateWithExistingEntity;
        const expectedNewState = Object.assign({}, initialState);
        delete expectedNewState['3'];

        const newState = reducer(initialState, action);
        expect(newState).to.deep.equal(expectedNewState);
        expect(newState).to.not.equal(initialState);
      },
    );

    it('does nothing if the project does not exist', () => {
      const action = {
        type: Requests.actions.Projects.DeleteProject.SUCCESS.type,
        id: 7,
      };
      const initialState = expectedStateWithExistingEntity;
      const newState = reducer(initialState, action);

      expect(newState).to.deep.equal(initialState);
      expect(newState).to.equal(initialState);
    });
  });

  describe('removing a project', () => {
    it('TODO');
  });

  describe('updating a project', () => {
    it('TODO');
  });

  describe('add authors to project', () => {
    it('TODO');
  });
});
