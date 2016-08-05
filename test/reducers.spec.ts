import { expect } from 'chai';
import { merge } from 'lodash';
import { Reducer } from 'redux';

import Branches, { BranchState } from '../src/js/modules/branches';
import Commits, { CommitState } from '../src/js/modules/commits';
import Deployments, { DeploymentState } from '../src/js/modules/deployments';
import Projects, { ProjectState } from '../src/js/modules/projects';

import * as testData from './test-data';

const testInitialState = (reducer: Reducer<any>, expectedState: any) => {
  it('returns the correct default state', () => {
    expect(reducer(undefined, { type: 'foobar' })).to.deep.equal(expectedState);
  });
};

const testStoreEntities = (
  reducer: Reducer<any>,
  action: any,
  expectedStateFromEmpty: any,
  stateWithoutExistingEntity: any,
  expectedStateWithoutExistingEntity: any,
  stateWithExistingEntity: any,
  expectedStateWithExistingEntity: any,
) => {
  describe('store entities', () => {
    it(`(${action.type}) with an empty initial state`, () => {
      expect(reducer(undefined, action)).to.deep.equal(expectedStateFromEmpty);
    });

    it(`(${action.type}) makes no changes with an empty list`, () => {
      const emptyAction = { type: action.type, entities: <any[]>[] };
      const newState = reducer(stateWithoutExistingEntity, emptyAction);
      expect(newState).to.deep.equal(stateWithoutExistingEntity);
      expect(newState).to.equal(stateWithoutExistingEntity);
    });

    it(`(${action.type}) with other entities in state`, () => {
      const newState = reducer(stateWithoutExistingEntity, action);
      expect(newState).to.deep.equal(expectedStateWithoutExistingEntity);
      expect(newState).to.not.equal(stateWithoutExistingEntity); // make sure not mutated
    });

    it(`(${action.type}) by overwriting existing entities`, () => {
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(expectedStateWithExistingEntity);
      expect(newState).to.not.equal(stateWithExistingEntity); // make sure not mutated
    });
  });
};

describe('reducers:', () => {
  describe('activities:', () => {
    // TODO
  });

  describe('branches:', () => {
    const { reducer } = Branches;

    testInitialState(reducer, {});

    const action = {
      type: Branches.actions.STORE_BRANCHES,
      entities: testData.projectResponse.included.slice(0, 2),
    };

    const expectedObjects: BranchState  = {
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
    const expectedStateFromEmpty = expectedObjects;
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
    const expectedStateWithoutExistingEntity = merge(stateWithoutExistingEntity, expectedObjects);
    const stateWithExistingEntity: BranchState = {
      3: {
        id: '3',
        'name': 'third-branch-foo',
        'description': undefined,
        'commits': ['aacd00f03', 'a998833433'],
        'deployments': <string[]> [],
        'project': '1',
      },
      2: {
        id: '2',
        'name': 'second-branch-foo',
        'description': undefined,
        'commits': ['a998823423'],
        'deployments': ['8'],
        'project': '1',
      },
    };
    const expectedStateWithExistingEntity = merge(stateWithExistingEntity, expectedObjects);

    testStoreEntities(
      reducer,
      action,
      expectedStateFromEmpty,
      stateWithoutExistingEntity,
      expectedStateWithoutExistingEntity,
      stateWithExistingEntity,
      expectedStateWithExistingEntity
    );
  });

  describe('commits:', () => {
    const { reducer } = Commits;

    testInitialState(reducer, {});

    const action = {
      type: Commits.actions.STORE_COMMITS,
      entities: testData.commitResponse.included.slice(0, 2),
    };

    const expectedObjects: CommitState  = {
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
    const expectedStateFromEmpty = expectedObjects;
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
    const expectedStateWithoutExistingEntity = merge(stateWithoutExistingEntity, expectedObjects);
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
    const expectedStateWithExistingEntity = merge(stateWithExistingEntity, expectedObjects);

    testStoreEntities(
      reducer,
      action,
      expectedStateFromEmpty,
      stateWithoutExistingEntity,
      expectedStateWithoutExistingEntity,
      stateWithExistingEntity,
      expectedStateWithExistingEntity
    );
  });

  describe('deployments:', () => {
    const { reducer } = Deployments;

    testInitialState(reducer, {});

    const action = {
      type: Deployments.actions.STORE_DEPLOYMENTS,
      entities: testData.branchResponse.included.slice(1, 2),
    };

    const expectedObjects: DeploymentState = {
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
    const expectedStateFromEmpty = expectedObjects;
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
    const expectedStateWithoutExistingEntity = merge(stateWithoutExistingEntity, expectedObjects);
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
    const expectedStateWithExistingEntity = merge(stateWithExistingEntity, expectedObjects);

    testStoreEntities(
      reducer,
      action,
      expectedStateFromEmpty,
      stateWithoutExistingEntity,
      expectedStateWithoutExistingEntity,
      stateWithExistingEntity,
      expectedStateWithExistingEntity
    );
  });

  describe('projects:', () => {
    const { reducer } = Projects;

    testInitialState(reducer, <ProjectState> {});

    const action = {
      type: Projects.actions.STORE_PROJECTS,
      entities: testData.projectsResponse.data,
    };

    const expectedObjects: ProjectState = {
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
    const expectedStateFromEmpty = expectedObjects;
    const stateWithoutExistingEntity: ProjectState = {
      '3': {
        'id': '3',
        'name': 'Third project',
        'description': undefined,
        'activeUsers': [],
        'branches': [],
      },
    };
    const expectedStateWithoutExistingEntity = merge(stateWithoutExistingEntity, expectedObjects);
    const stateWithExistingEntity: ProjectState = {
      '3': {
        'id': '3',
        'name': 'Third project a',
        'description': undefined,
        'activeUsers': [],
        'branches': [],
      },
      '2': {
        'id': '2',
        'name': 'Second project again',
        'description': 'foobar',
        'activeUsers': ['user@domain.com'],
        'branches': [],
      },
    };
    const expectedStateWithExistingEntity = merge(stateWithExistingEntity, expectedObjects);

    testStoreEntities(
      reducer,
      action,
      expectedStateFromEmpty,
      stateWithoutExistingEntity,
      expectedStateWithoutExistingEntity,
      stateWithExistingEntity,
      expectedStateWithExistingEntity
    );
  });
});
