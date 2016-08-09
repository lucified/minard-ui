import { expect } from 'chai';
import { assign } from 'lodash';
import { Action, Reducer } from 'redux';

import Activities, { ActivityState, ActivityType } from '../src/js/modules/activities';
import Branches, { BranchState } from '../src/js/modules/branches';
import Commits, { CommitState } from '../src/js/modules/commits';
import Deployments, { DeploymentState } from '../src/js/modules/deployments';
import { FetchError } from '../src/js/modules/errors';
import Projects, { ProjectState } from '../src/js/modules/projects';

import * as testData from './test-data';

type ModuleState = BranchState | CommitState | DeploymentState | ProjectState | ActivityState;
interface AnyAction extends Action {
  [field: string]: any;
};

// TODO: test Errors reducer

const testInitialState = (reducer: Reducer<ModuleState>, expectedState: ModuleState) => {
  it('returns the correct default state', () => {
    expect(reducer(undefined, { type: 'foobar' })).to.deep.equal(expectedState);
  });
};

const testStoreEntities = (
  reducer: Reducer<ModuleState>,
  action: AnyAction,
  expectedStateFromEmpty: ModuleState,
  stateWithoutExistingEntity: ModuleState,
  expectedStateWithoutExistingEntity: ModuleState,
  stateWithExistingEntity: ModuleState,
  expectedStateWithExistingEntity: ModuleState,
) => {
  describe(`store entities (${action.type})`, () => {
    it('with an empty initial state', () => {
      expect(reducer(undefined, action)).to.deep.equal(expectedStateFromEmpty);
    });

    it('makes no changes with an empty list', () => {
      const emptyAction = { type: action.type, entities: <any[]> [] };
      const newState = reducer(stateWithoutExistingEntity, emptyAction);
      expect(newState).to.deep.equal(stateWithoutExistingEntity);
      expect(newState).to.equal(stateWithoutExistingEntity);
    });

    it('with other entities in state', () => {
      const newState = reducer(stateWithoutExistingEntity, action);
      expect(newState).to.deep.equal(expectedStateWithoutExistingEntity);
      expect(newState).to.not.equal(stateWithoutExistingEntity); // make sure not mutated
    });

    it('by overwriting existing entities', () => {
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(expectedStateWithExistingEntity);
      expect(newState).to.not.equal(stateWithExistingEntity); // make sure not mutated
    });
  });
};

const testSuccessfulRequest = (
  reducer: Reducer<ModuleState>,
  action: AnyAction,
  expectedStateFromEmpty: ModuleState,
  stateWithoutExistingEntity: ModuleState,
  expectedStateWithoutExistingEntity: ModuleState,
  stateWithExistingEntity: ModuleState,
  expectedStateWithExistingEntity: ModuleState,
) => {
  describe(`successful request (${action.type})`, () => {
    it('with an empty initial state', () => {
      const expected = expectedStateFromEmpty;

      expect(reducer(undefined, action)).to.deep.equal(expected);
    });

    it('makes no changes with an empty result', () => {
      const emptyAction: AnyAction = {
        type: action.type,
        response: undefined,
      };
      const oldState = stateWithoutExistingEntity;
      const expected = stateWithoutExistingEntity;
      const newState = reducer(oldState, emptyAction);

      expect(newState).to.deep.equal(expected);
      expect(newState).to.equal(expected);
    });

    it('with other entities in state', () => {
      const oldState = stateWithoutExistingEntity;
      const expected = expectedStateWithoutExistingEntity;
      const newState = reducer(oldState, action);

      expect(newState).to.deep.equal(expected);
      expect(newState).to.not.equal(oldState); // make sure not mutated
    });

    it('by overwriting existing entities', () => {
      const oldState = stateWithExistingEntity;
      const expected = expectedStateWithExistingEntity;
      const newState = reducer(oldState, action);

      expect(newState).to.deep.equal(expected);
      expect(newState).to.not.equal(oldState); // make sure not mutated
    });
  });
};

const testFailedRequest = (
  reducer: Reducer<ModuleState>,
  action: AnyAction,
  expectedStateFromEmpty: ModuleState,
  stateWithoutExistingEntity: ModuleState,
  expectedStateWithoutExistingEntity: ModuleState,
  stateWithExistingEntity: ModuleState,
) => {
  describe(`failed request (${action.type})`, () => {
    it('with an empty initial state', () => {
      expect(reducer(undefined, action)).to.deep.equal(expectedStateFromEmpty);
    });

    it('with other entities in state', () => {
      const newState = reducer(stateWithoutExistingEntity, action);
      expect(newState).to.deep.equal(expectedStateWithoutExistingEntity);
      expect(newState).to.not.equal(stateWithoutExistingEntity); // make sure not mutated
    });

    it('by not overwriting existing entities', () => {
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity); // make sure not mutated
    });
  });
};

const testReducer = (
  reducer: Reducer<ModuleState>,
  storeAction: { type: string, entities: any },
  expectedObjectsToStore: ModuleState,
  stateWithoutExistingEntity: ModuleState,
  stateWithExistingEntity: ModuleState,
  successfulRequestAction: { type: string, response: any },
  expectedSuccessfulRequestObject: ModuleState,
  failedRequestAction: FetchError,
) => {
  testInitialState(reducer, {});

  let expectedStateFromEmpty = expectedObjectsToStore;
  let expectedStateWithoutExistingEntity =
    assign<ModuleState, ModuleState>({}, stateWithoutExistingEntity, expectedObjectsToStore);
  let expectedStateWithExistingEntity =
    assign<ModuleState, ModuleState>({}, stateWithExistingEntity, expectedObjectsToStore);

  testStoreEntities(
    reducer,
    storeAction,
    expectedStateFromEmpty,
    stateWithoutExistingEntity,
    expectedStateWithoutExistingEntity,
    stateWithExistingEntity,
    expectedStateWithExistingEntity,
  );

  expectedStateFromEmpty = expectedSuccessfulRequestObject;
  expectedStateWithoutExistingEntity =
    assign<ModuleState, ModuleState>({}, stateWithoutExistingEntity, expectedSuccessfulRequestObject);
  expectedStateWithExistingEntity =
    assign<ModuleState, ModuleState>({}, stateWithExistingEntity, expectedSuccessfulRequestObject);

  testSuccessfulRequest(
    reducer,
    successfulRequestAction,
    expectedStateFromEmpty,
    stateWithoutExistingEntity,
    expectedStateWithoutExistingEntity,
    stateWithExistingEntity,
    expectedStateWithExistingEntity,
  );

  expectedStateFromEmpty = { [failedRequestAction.id]: failedRequestAction };
  expectedStateWithoutExistingEntity =
    assign<ModuleState, ModuleState>({}, stateWithoutExistingEntity, expectedStateFromEmpty);

  testFailedRequest(
    reducer,
    failedRequestAction,
    expectedStateFromEmpty,
    stateWithoutExistingEntity,
    expectedStateWithoutExistingEntity,
    stateWithExistingEntity,
  );
};

describe('reducers', () => {
  describe('activities', () => {
    const { reducer } = Activities;

    const storeAction = {
      type: Activities.actions.STORE_ACTIVITIES,
      entities: testData.activitiesResponse.data,
    };

    const successfulActivitiesRequestAction = {
      type: Activities.actions.ACTIVITIES.SUCCESS,
      response: testData.activitiesResponse.data,
    };

    const expectedObjectsToStore: ActivityState = {
      1: {
        id: '1',
        type: ActivityType.Deployment,
        deployment: '7',
        branch: '1',
        timestamp: 1470131481802,
      },
      2: {
        id: '2',
        type: ActivityType.Deployment,
        deployment: '8',
        branch: '2',
        timestamp: 1470045081802,
      },
    };

    const stateWithoutExistingEntity: ActivityState = {
      3: {
        id: '3',
        type: ActivityType.Deployment,
        deployment: '1',
        branch: '3',
        timestamp: 1469945081802,
      },
    };

    const stateWithExistingEntity: ActivityState = {
      1: {
        id: '1',
        type: ActivityType.Deployment,
        deployment: '2',
        branch: '1',
        timestamp: 1470101481802,
      },
      3: {
        id: '3',
        type: ActivityType.Deployment,
        deployment: '1',
        branch: '3',
        timestamp: 1469945081802,
      },
    };

    const expectedStateWithoutExistingEntity =
      assign<ModuleState, ModuleState>({}, stateWithoutExistingEntity, expectedObjectsToStore);
    const expectedStateWithExistingEntity =
      assign<ModuleState, ModuleState>({}, stateWithExistingEntity, expectedObjectsToStore);

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
        expect(reducer(undefined, successfulActivitiesRequestAction)).to.deep.equal(expectedObjectsToStore);
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
  });

  describe('branches', () => {
    const { reducer } = Branches;

    const storeAction = {
      type: Branches.actions.STORE_BRANCHES,
      entities: testData.projectResponse.included.slice(0, 2),
    };

    const expectedObjectsToStore: BranchState = {
      1: {
        id: '1',
        'name': 'first-branch',
        'description': 'This is a branch description',
        'deployments': ['7'],
        'commits': ['aacceeff02', '12354124', '2543452', '098325343', '29832572fc1', '29752a385'],
        'project': '1',
      },
      2: {
        id: '2',
        'name': 'second-branch',
        'description': undefined,
        'commits': ['aacd00f02', 'a998823423'],
        'deployments': ['8'],
        'project': '1',
      },
    };

    const stateWithoutExistingEntity: BranchState = {
      3: {
        id: '3',
        'name': 'third-branch',
        'description': undefined,
        'commits': ['aacd00f03', 'a998833433'],
        'deployments': <string[]> [],
        'project': '1',
      },
    };

    const stateWithExistingEntity: BranchState = {
      3: {
        id: '3',
        'name': 'third-branch-foo',
        'description': undefined,
        'commits': ['aacd00f03', 'a998833433'],
        'deployments': <string[]> [],
        'project': '1',
      },
      1: {
        id: '1',
        'name': 'first-branch-foo',
        'description': undefined,
        'commits': ['a998823423'],
        'deployments': ['8'],
        'project': '1',
      },
    };

    const successfulRequestAction = {
      type: Branches.actions.BRANCH.SUCCESS,
      response: testData.branchResponseNoInclude.data,
    };

    const expectedSuccessfulRequestObject: BranchState = {
      1: {
        'id': '1',
        'name': 'first-branch',
        'description': 'This is a branch description',
        'deployments': ['7'],
        'commits': ['aacceeff02', '12354124', '2543452', '098325343', '29832572fc1', '29752a385'],
        'project': '1',
      },
    };

    const failedRequestObject: FetchError = {
      id: '1',
      type: Branches.actions.BRANCH.FAILURE,
      error: 'Error message in testing',
      prettyError: 'Pretty error message in testing',
    };

    testReducer(
      reducer,
      storeAction,
      expectedObjectsToStore,
      stateWithoutExistingEntity,
      stateWithExistingEntity,
      successfulRequestAction,
      expectedSuccessfulRequestObject,
      failedRequestObject,
    );
  });

  describe('commits', () => {
    const { reducer } = Commits;

    const storeAction = {
      type: Commits.actions.STORE_COMMITS,
      entities: testData.commitResponse.included.slice(0, 2),
    };

    const expectedObjectsToStore: CommitState = {
      '12354124': {
        'id': '12354124',
        'hash': '0123456789abcdef',
        'author': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': 1470066081802,
        },
        'commiter': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': 1470066081802,
        },
        'message': 'Foobar is nice',
        'deployment': undefined,
        description: undefined,
      },
      '2543452': {
        'id': '2543452',
        'hash': '0123456789abcdef',
        'author': {
          name: undefined,
          'email': 'juho@lucify.com',
          'timestamp': 1470055881802,
        },
        'commiter': {
          name: undefined,
          'email': 'juho@lucify.com',
          'timestamp': 1470055881802,
        },
        'message': 'Barbar barr barb aearr',
        'deployment': undefined,
        description: undefined,
      },
    };

    const stateWithoutExistingEntity: CommitState = {
      '098325343': {
        'id': '098325343',
        'hash': '0123456789abcdef',
        'author': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': 1470055881801,
        },
        'commiter': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': 1470055881801,
        },
        'message': 'This is a commit message',
        deployment: undefined,
        description: undefined,
      },
    };

    const stateWithExistingEntity: CommitState = {
      '098325343': {
        'id': '098325343',
        'hash': '0123456789abcdecccf',
        'author': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': 1470055881801,
        },
        'commiter': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': 1470055881801,
        },
        'message': 'This is a commit message',
        deployment: undefined,
        description: undefined,
      },
      '2543452': {
        'id': '2543452',
        'hash': '1235232141',
        'author': {
          name: undefined,
          'email': 'juho@lucify.com',
          'timestamp': 1470055881812,
        },
        'commiter': {
          name: undefined,
          'email': 'juho@lucify.com',
          'timestamp': 1470055881812,
        },
        'message': 'Barbar barearr',
        'deployment': undefined,
        description: undefined,
      },
    };

    const successfulRequestAction = {
      type: Commits.actions.COMMIT.SUCCESS,
      response: testData.commitResponseNoInclude.data,
    };

    const expectedSuccessfulRequestObject: CommitState = {
      'aacceeff02': {
        'id': 'aacceeff02',
        'hash': '0123456789abcdef',
        'author': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': 1470066681802,
        },
        'commiter': {
          'name': undefined,
          'email': 'juho@lucify.com',
          'timestamp': 1469800281802,
        },
        'message': 'Fix colors',
        'description': "The previous colors didn't look nice. Now they're much prettier.",
        'deployment': '7',
      },
    };

    const failedRequestObject: FetchError = {
      id: '2543452',
      type: Commits.actions.COMMIT.FAILURE,
      error: 'Error message in testing',
      prettyError: 'Pretty error message in testing',
    };

    testReducer(
      reducer,
      storeAction,
      expectedObjectsToStore,
      stateWithoutExistingEntity,
      stateWithExistingEntity,
      successfulRequestAction,
      expectedSuccessfulRequestObject,
      failedRequestObject,
    );
  });

  describe('deployments', () => {
    const { reducer } = Deployments;

    const storeAction = {
      type: Deployments.actions.STORE_DEPLOYMENTS,
      entities: testData.branchResponse.included.slice(1, 2),
    };

    const expectedObjectsToStore: DeploymentState = {
      '7': {
        'id': '7',
        'url': '#',
        'screenshot': '#',
        'creator': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': 1470131481802,
        },
        'commit': 'aacceeff02',
      },
    };

    const stateWithoutExistingEntity: DeploymentState = {
      '8': {
        'id': '8',
        'url': '#',
        'screenshot': '#',
        'creator': {
          'name': undefined,
          'email': 'juho@lucify.com',
          'timestamp': 1470131581802,
        },
        'commit': '2543452',
      },
    };

    const stateWithExistingEntity: DeploymentState = {
      '7': {
        'id': '7',
        'url': 'foo#',
        'screenshot': 'bar#',
        'creator': {
          'name': 'Ville',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': 1470131481802,
        },
        'commit': '123468594',
      },
    };

    const successfulRequestAction = {
      type: Deployments.actions.DEPLOYMENT.SUCCESS,
      response: testData.deploymentResponseNoInclude.data,
    };

    const expectedSuccessfulRequestObject: DeploymentState = {
      '7': {
        'id': '7',
        'url': '#',
        'screenshot': '#',
        'creator': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': 1470131481802,
        },
        'commit': 'aacceeff02',
      },
    };

    const failedRequestObject: FetchError = {
      id: '7',
      type: Deployments.actions.DEPLOYMENT.FAILURE,
      error: 'Error message in testing',
      prettyError: 'Pretty error message in testing',
    };

    testReducer(
      reducer,
      storeAction,
      expectedObjectsToStore,
      stateWithoutExistingEntity,
      stateWithExistingEntity,
      successfulRequestAction,
      expectedSuccessfulRequestObject,
      failedRequestObject,
    );
  });

  describe('projects', () => {
    const { reducer } = Projects;

    const storeAction = {
      type: Projects.actions.STORE_PROJECTS,
      entities: testData.projectsResponse.data,
    };

    const expectedObjectsToStore: ProjectState = {
      '1': {
        'id': '1',
        'name': 'First project',
        'description': 'This is the first project description. It might not be set.',
        'activeUsers': ['ville.saarinen@lucify.com', 'juho@lucify.com'],
        'branches': ['1', '2', '3'],
      },
      '2': {
        'id': '2',
        'name': 'Second project',
        'description': undefined,
        'activeUsers': [],
        'branches': [],
      },
    };

    const stateWithoutExistingEntity: ProjectState = {
      '3': {
        'id': '3',
        'name': 'Third project',
        'description': undefined,
        'activeUsers': [],
        'branches': [],
      },
    };

    const stateWithExistingEntity: ProjectState = {
      '3': {
        'id': '3',
        'name': 'Third project a',
        'description': undefined,
        'activeUsers': [],
        'branches': [],
      },
      '1': {
        'id': '1',
        'name': 'First project again',
        'description': 'foobar',
        'activeUsers': ['user@domain.com'],
        'branches': [],
      },
    };

    const successfulRequestAction = {
      type: Projects.actions.PROJECT.SUCCESS,
      response: testData.projectResponseNoInclude.data,
    };

    const expectedSuccessfulRequestObject: ProjectState = {
      1: {
        'id': '1',
        'name': 'First project',
        'description': 'This is the first project description. It might not be set.',
        'activeUsers': ['ville.saarinen@lucify.com', 'juho@lucify.com'],
        'branches': ['1', '2', '3'],
      },
    };

    const failedRequestObject: FetchError = {
      id: '1',
      type: Projects.actions.PROJECT.FAILURE,
      error: 'Error message in testing',
      prettyError: 'Pretty error message in testing',
    };

    testReducer(
      reducer,
      storeAction,
      expectedObjectsToStore,
      stateWithoutExistingEntity,
      stateWithExistingEntity,
      successfulRequestAction,
      expectedSuccessfulRequestObject,
      failedRequestObject,
    );

    const successfulAllProjectsRequestAction = {
      type: Projects.actions.ALL_PROJECTS.SUCCESS,
      response: testData.projectsResponse.data,
    };

    const allProjectsObjects = expectedObjectsToStore;
    const expectedStateWithoutExistingEntity =
      assign<ModuleState, ModuleState>({}, stateWithoutExistingEntity, allProjectsObjects);
    const expectedStateWithExistingEntity =
      assign<ModuleState, ModuleState>({}, stateWithExistingEntity, allProjectsObjects);

    describe(`successful request all projects (${successfulAllProjectsRequestAction.type})`, () => {
      it('with an empty initial state', () => {
        expect(reducer(undefined, successfulAllProjectsRequestAction)).to.deep.equal(allProjectsObjects);
      });

      it('makes no changes with an empty list', () => {
        const emptyAction = { type: successfulAllProjectsRequestAction.type, entities: <any[]> [] };
        const newState = reducer(stateWithoutExistingEntity, emptyAction);
        expect(newState).to.deep.equal(stateWithoutExistingEntity);
        expect(newState).to.equal(stateWithoutExistingEntity);
      });

      it('with other entities in state', () => {
        const newState = reducer(stateWithoutExistingEntity, successfulAllProjectsRequestAction);
        expect(newState).to.deep.equal(expectedStateWithoutExistingEntity);
        expect(newState).to.not.equal(stateWithoutExistingEntity); // make sure not mutated
      });

      it('by overwriting existing entities', () => {
        const newState = reducer(stateWithExistingEntity, successfulAllProjectsRequestAction);
        expect(newState).to.deep.equal(expectedStateWithExistingEntity);
        expect(newState).to.not.equal(stateWithExistingEntity); // make sure not mutated
      });
    });
  });
});
