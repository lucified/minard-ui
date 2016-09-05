import { expect } from 'chai';
import { Action, Reducer } from 'redux';

import Activities, { ActivityState, ActivityType } from '../src/js/modules/activities';
import Branches, { BranchState } from '../src/js/modules/branches';
import Commits, { CommitState } from '../src/js/modules/commits';
import Deployments, { DeploymentState } from '../src/js/modules/deployments';
import Errors, { DeleteError, ErrorState } from '../src/js/modules/errors';
import { FetchError } from '../src/js/modules/errors';
import Modal, { ModalType } from '../src/js/modules/modal';
import Projects, { ProjectState } from '../src/js/modules/projects';
import Requests, { RequestsState } from '../src/js/modules/requests';
import Selected, { SelectedState } from '../src/js/modules/selected';

import * as testData from './test-data';

type ModuleState = BranchState | CommitState | DeploymentState | ProjectState | ActivityState;
interface AnyAction extends Action {
  [field: string]: any;
};

const testInitialState = (reducer: Reducer<ModuleState>, expectedState: ModuleState) => {
  it('returns the correct default state', () => {
    expect(reducer(<any> undefined, { type: 'foobar' })).to.deep.equal(expectedState);
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
      expect(reducer(<any> undefined, action)).to.deep.equal(expectedStateFromEmpty);
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

      expect(reducer(<any> undefined, action)).to.deep.equal(expected);
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
      expect(reducer(<any> undefined, action)).to.deep.equal(expectedStateFromEmpty);
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
  let expectedStateWithoutExistingEntity = Object.assign({}, stateWithoutExistingEntity, expectedObjectsToStore);
  let expectedStateWithExistingEntity = Object.assign({}, stateWithExistingEntity, expectedObjectsToStore);

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
  expectedStateWithoutExistingEntity = Object.assign({}, stateWithoutExistingEntity, expectedSuccessfulRequestObject);
  expectedStateWithExistingEntity = Object.assign({}, stateWithExistingEntity, expectedSuccessfulRequestObject);

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
  expectedStateWithoutExistingEntity = Object.assign({}, stateWithoutExistingEntity, expectedStateFromEmpty);

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
  describe('modal', () => {
    const { reducer } = Modal;

    it('opens a modal dialog when one is not open', () => {
      const type = ModalType.NewProject;
      const action = Modal.actions.openModal(type);
      const initialState = null;
      const expectedState = { type };

      expect(reducer(initialState, action)).to.deep.equal(expectedState);
    });

    it('does nothing when opening a modal that is already open', () => {
      const type = ModalType.NewProject;
      const action = Modal.actions.openModal(type);
      const initialState = { type };
      const expectedState = { type };

      expect(reducer(initialState, action)).to.deep.equal(expectedState);
    });

    it('does nothing when opening a modal when another modal is already open', () => {
      const action = Modal.actions.openModal(ModalType.NewProject);
      const initialState = { type: ModalType.ProjectSettings };
      const expectedState = { type: ModalType.ProjectSettings };

      expect(reducer(initialState, action)).to.deep.equal(expectedState);
    });

    it('closes a modal dialog', () => {
      const action = Modal.actions.closeModal(ModalType.ProjectSettings);
      const initialState = { type: ModalType.ProjectSettings };
      const expectedState = null;

      expect(reducer(initialState, action)).to.deep.equal(expectedState);
    });

    it('does not close a modal dialog of a different type', () => {
      const action = Modal.actions.closeModal(ModalType.NewProject);
      const initialState = { type: ModalType.ProjectSettings };
      const expectedState = { type: ModalType.ProjectSettings };

      expect(reducer(initialState, action)).to.deep.equal(expectedState);
    });

    it('does nothing when closing a modal when none are open', () => {
      const action = Modal.actions.closeModal(ModalType.NewProject);
      const initialState = null;
      const expectedState = null;

      expect(reducer(initialState, action)).to.deep.equal(expectedState);
    });
  });

  describe('requests', () => {
    const { reducer } = Requests;

    describe('fetch all projects', () => {
      it('stores request information', () => {
        const initialState: RequestsState = [];
        const action = {
          type: Projects.actions.ALL_PROJECTS.REQUEST,
        };
        const expectedState = [action];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request succeeds', () => {
        const initialState: RequestsState = [{
          type: Projects.actions.ALL_PROJECTS.REQUEST,
        }];
        const action = {
          type: Projects.actions.ALL_PROJECTS.SUCCESS,
        };
        const expectedState = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request fails', () => {
        const initialState: RequestsState = [{
          type: Projects.actions.ALL_PROJECTS.REQUEST,
        }];
        const action = {
          type: Projects.actions.ALL_PROJECTS.FAILURE,
        };
        const expectedState = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });
    });

    describe('fetch all activities', () => {
      it('stores request information', () => {
        const initialState: RequestsState = [];
        const action = {
          type: Activities.actions.ACTIVITIES.REQUEST,
        };
        const expectedState = [action];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request succeeds', () => {
        const initialState: RequestsState = [{
          type: Activities.actions.ACTIVITIES.REQUEST,
        }];
        const action = {
          type: Activities.actions.ACTIVITIES.SUCCESS,
        };
        const expectedState = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request fails', () => {
        const initialState: RequestsState = [{
          type: Activities.actions.ACTIVITIES.REQUEST,
        }];
        const action = {
          type: Activities.actions.ACTIVITIES.FAILURE,
        };
        const expectedState = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });
    });

    describe('fetch all activities for project', () => {
      it('stores request information', () => {
        const initialState: RequestsState = [];
        const action = {
          type: Activities.actions.ACTIVITIES_FOR_PROJECT.REQUEST,
          id: 'foo',
        };
        const expectedState = [action];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request succeeds', () => {
        const initialState: RequestsState = [{
          type: Activities.actions.ACTIVITIES_FOR_PROJECT.REQUEST,
          id: 'foo',
        }];
        const action = {
          type: Activities.actions.ACTIVITIES_FOR_PROJECT.SUCCESS,
          id: 'foo',
        };
        const expectedState = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request fails', () => {
        const initialState: RequestsState = [{
          type: Activities.actions.ACTIVITIES_FOR_PROJECT.REQUEST,
          id: 'foo',
        }];
        const action = {
          type: Activities.actions.ACTIVITIES_FOR_PROJECT.FAILURE,
          id: 'foo',
        };
        const expectedState = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });
    });

    describe('delete project', () => {
      it('stores request information', () => {
        const initialState: RequestsState = [];
        const action = {
          type: Projects.actions.SEND_DELETE_PROJECT.REQUEST,
          id: 'foo',
        };
        const expectedState = [action];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request succeeds', () => {
        const initialState: RequestsState = [{
          type: Projects.actions.SEND_DELETE_PROJECT.REQUEST,
          id: 'foo',
        }];
        const action = {
          type: Projects.actions.SEND_DELETE_PROJECT.SUCCESS,
          id: 'foo',
        };
        const expectedState = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request fails', () => {
        const initialState: RequestsState = [{
          type: Projects.actions.SEND_DELETE_PROJECT.REQUEST,
          id: 'foo',
        }];
        const action = {
          type: Projects.actions.SEND_DELETE_PROJECT.FAILURE,
          id: 'foo',
        };
        const expectedState = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });
    });
  });

  describe('selected', () => {
    const { reducer } = Selected;

    it('adds selected project and branch to empty state', () => {
      const action: any = {
        type: Selected.actions.SET_SELECTED,
        project: 'p',
        branch: 'b',
      };

      const expectedState: SelectedState = {
        project: 'p',
        branch: 'b',
      };

      const endState: SelectedState = reducer(<any> undefined, action);

      expect(endState).to.deep.equal(expectedState);
    });

    it('it replaces existing selections', () => {
      const action: any = {
        type: Selected.actions.SET_SELECTED,
        project: 'p',
        branch: 'b',
      };

      const initialState: SelectedState = {
        project: 'p2',
        branch: 'b2',
      };

      const expectedState: SelectedState = {
        project: 'p',
        branch: 'b',
      };

      const endState: SelectedState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('it clears existing selections', () => {
      const action: any = {
        type: Selected.actions.SET_SELECTED,
        project: null,
        branch: null,
      };

      const initialState: SelectedState = {
        project: 'p2',
        branch: 'b',
      };

      const expectedState: SelectedState = {
        project: null,
        branch: null,
      };

      const endState: SelectedState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });
  });

  describe('errors', () => {
    const { reducer } = Errors;

    it('adds error to an empty initial state', () => {
      const action: any = {
        type: Projects.actions.ALL_PROJECTS.FAILURE,
        id: null,
        error: 'projects fetch error',
        prettyError: 'pretty error',
      };

      const expectedState = [action];

      const endState = reducer(<any> undefined, action);

      expect(endState).to.deep.equal(expectedState);
    });

    it('adds error when requesting all projects fails', () => {
      const initialState: ErrorState = [
        {
          id: null,
          type: Activities.actions.ACTIVITIES.FAILURE,
          error: 'foobar error',
          prettyError: 'pretty foobar error',
        },
      ];

      const action: any = {
        type: Projects.actions.ALL_PROJECTS.FAILURE,
        id: null,
        error: 'projects fetch error',
        prettyError: 'pretty error',
      };

      const expectedState = initialState.concat(action);

      const endState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('adds error when requesting activities fails', () => {
      const initialState: ErrorState = [
        {
          type: Projects.actions.ALL_PROJECTS.FAILURE,
          id: null,
          error: 'projects fetch error',
          prettyError: 'pretty error',
        },
      ];

      const action: any = {
        id: null,
        type: Activities.actions.ACTIVITIES.FAILURE,
        error: 'foobar error',
        prettyError: 'pretty foobar error',
      };

      const expectedState = initialState.concat(action);

      const endState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('clears all projects fetching error when starting new request', () => {
      const initialState: ErrorState = [
        {
          type: Projects.actions.ALL_PROJECTS.FAILURE,
          id: null,
          error: 'projects fetch error',
          prettyError: 'pretty error',
        },
        {
          type: Projects.actions.ALL_PROJECTS.FAILURE,
          id: null,
          error: 'another projects fetch error',
          prettyError: 'another pretty error',
        },
        {
          id: null,
          type: Activities.actions.ACTIVITIES.FAILURE,
          error: 'foobar error',
          prettyError: 'pretty foobar error',
        },
      ];

      const action: any = {
        type: Projects.actions.ALL_PROJECTS.REQUEST,
      };

      const expectedState = initialState.slice(2);

      const endState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('clears activity fetching error when starting new request', () => {
      const initialState: ErrorState = [
        {
          type: Projects.actions.ALL_PROJECTS.FAILURE,
          id: null,
          error: 'projects fetch error',
          prettyError: 'pretty error',
        },
        {
          type: Projects.actions.ALL_PROJECTS.FAILURE,
          id: null,
          error: 'another projects fetch error',
          prettyError: 'another pretty error',
        },
        {
          id: null,
          type: Activities.actions.ACTIVITIES.FAILURE,
          error: 'foobar error',
          prettyError: 'pretty foobar error',
        },
      ];

      const action: any = {
        type: Activities.actions.ACTIVITIES.REQUEST,
      };

      const expectedState = initialState.slice(0, 2);

      const endState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('adds an error when deleting a project fails', () => {
      const initialState: ErrorState = [];
      const action: DeleteError = {
        type: Projects.actions.SEND_DELETE_PROJECT.FAILURE,
        id: 'foo',
        error: 'failed',
        prettyError: 'failed',
      };
      const expectedState = [action];

      const newState = reducer(initialState, action);
      expect(newState).to.deep.equal(expectedState);
      expect(newState).to.not.equal(initialState);
    });

    it('clears the error when trying to delete a project again', () => {
      const initialState: ErrorState = [{
        type: Projects.actions.SEND_DELETE_PROJECT.FAILURE,
        id: 'foo',
        error: 'failed',
        prettyError: 'failed',
      }];
      const action = {
        type: Projects.actions.SEND_DELETE_PROJECT.REQUEST,
        id: 'foo',
      };
      const expectedState = [];

      const newState = reducer(initialState, action);
      expect(newState).to.deep.equal(expectedState);
      expect(newState).to.not.equal(initialState);
    });

    it(`clears all project deletion errors on ${Errors.actions.CLEAR_PROJECT_DELETION_ERRORS}`, () => {
      const initialState: ErrorState = [
        {
          type: Projects.actions.ALL_PROJECTS.FAILURE,
          id: null,
          error: 'projects fetch error',
          prettyError: 'pretty error',
        },
        {
          type: Projects.actions.ALL_PROJECTS.FAILURE,
          id: null,
          error: 'another projects fetch error',
          prettyError: 'another pretty error',
        },
        {
          id: null,
          type: Activities.actions.ACTIVITIES.FAILURE,
          error: 'foobar error',
          prettyError: 'pretty foobar error',
        },
        {
          type: Projects.actions.SEND_DELETE_PROJECT.FAILURE,
          id: 'foo',
          error: 'failed',
          prettyError: 'failed',
        },
        {
          type: Projects.actions.SEND_DELETE_PROJECT.FAILURE,
          id: 'bar',
          error: 'failed',
          prettyError: 'failed',
        },
      ];
      const action = {
        type: Errors.actions.CLEAR_PROJECT_DELETION_ERRORS,
      };
      const expectedState = [
        {
          type: Projects.actions.ALL_PROJECTS.FAILURE,
          id: null,
          error: 'projects fetch error',
          prettyError: 'pretty error',
        },
        {
          type: Projects.actions.ALL_PROJECTS.FAILURE,
          id: null,
          error: 'another projects fetch error',
          prettyError: 'another pretty error',
        },
        {
          id: null,
          type: Activities.actions.ACTIVITIES.FAILURE,
          error: 'foobar error',
          prettyError: 'pretty foobar error',
        },
      ];

      const newState = reducer(initialState, action);
      expect(newState).to.deep.equal(expectedState);
      expect(newState).to.not.equal(initialState);
    });

    it(`does nothing on ${Errors.actions.CLEAR_PROJECT_DELETION_ERRORS} when no deletion errors exist`, () => {
      const initialState: ErrorState = [
        {
          type: Projects.actions.ALL_PROJECTS.FAILURE,
          id: null,
          error: 'projects fetch error',
          prettyError: 'pretty error',
        },
        {
          type: Projects.actions.ALL_PROJECTS.FAILURE,
          id: null,
          error: 'another projects fetch error',
          prettyError: 'another pretty error',
        },
        {
          id: null,
          type: Activities.actions.ACTIVITIES.FAILURE,
          error: 'foobar error',
          prettyError: 'pretty foobar error',
        },
      ];
      const action = {
        type: Errors.actions.CLEAR_PROJECT_DELETION_ERRORS,
      };
      const expectedState = initialState;

      const newState = reducer(initialState, action);
      expect(newState).to.deep.equal(expectedState);
      expect(newState).to.equal(initialState);
    });
  });

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

    const successfulActivitiesForProjectRequestAction = {
      type: Activities.actions.ACTIVITIES_FOR_PROJECT.SUCCESS,
      response: testData.activitiesResponse.data,
    };

    const expectedObjectsToStore: ActivityState = {
      1: {
        id: '1',
        type: ActivityType.Deployment,
        deployment: '7',
        branch: '1',
        project: '1',
        timestamp: 1470131481802,
      },
      2: {
        id: '2',
        type: ActivityType.Deployment,
        deployment: '8',
        branch: '2',
        project: '1',
        timestamp: 1470045081802,
      },
    };

    const stateWithoutExistingEntity: ActivityState = {
      3: {
        id: '3',
        type: ActivityType.Deployment,
        deployment: '1',
        branch: '3',
        project: '2',
        timestamp: 1469945081802,
      },
    };

    const stateWithExistingEntity: ActivityState = {
      1: {
        id: '1',
        type: ActivityType.Deployment,
        deployment: '2',
        branch: '1',
        project: '3',
        timestamp: 1470101481802,
      },
      3: {
        id: '3',
        type: ActivityType.Deployment,
        deployment: '1',
        branch: '3',
        project: '2',
        timestamp: 1469945081802,
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
  });

  describe('branches', () => {
    const { reducer } = Branches;

    const storeAction = {
      type: Branches.actions.STORE_BRANCHES,
      entities: testData.projectResponse.included!.slice(0, 2),
    };

    const expectedObjectsToStore: BranchState = {
      1: {
        id: '1',
        name: 'first-branch',
        description: 'This is a branch description',
        deployments: ['7'],
        commits: ['aacceeff02', '12354124', '2543452', '098325343', '29832572fc1', '29752a385'],
        project: '1',
      },
      2: {
        id: '2',
        name: 'second-branch',
        description: undefined,
        commits: ['aacd00f02', 'a998823423'],
        deployments: ['8'],
        project: '1',
      },
    };

    const stateWithoutExistingEntity: BranchState = {
      3: {
        id: '3',
        name: 'third-branch',
        description: undefined,
        commits: ['aacd00f03', 'a998833433'],
        deployments: <string[]> [],
        project: '1',
      },
    };

    const stateWithExistingEntity: BranchState = {
      3: {
        id: '3',
        name: 'third-branch-foo',
        description: undefined,
        commits: ['aacd00f03', 'a998833433'],
        deployments: <string[]> [],
        project: '1',
      },
      1: {
        id: '1',
        name: 'first-branch-foo',
        description: undefined,
        commits: ['a998823423'],
        deployments: ['8'],
        project: '1',
      },
    };

    const successfulRequestAction = {
      type: Branches.actions.BRANCH.SUCCESS,
      response: testData.branchResponse.data,
    };

    const expectedSuccessfulRequestObject: BranchState = {
      1: {
        id: '1',
        name: 'first-branch',
        description: 'This is a branch description',
        deployments: ['7'],
        commits: ['aacceeff02', '12354124', '2543452', '098325343', '29832572fc1', '29752a385'],
        project: '1',
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
      entities: testData.commitResponse.included!.slice(0, 2),
    };

    const expectedObjectsToStore: CommitState = {
      12354124: {
        id: '12354124',
        hash: '0123456789abcdef',
        author: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470066081802,
        },
        committer: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470066081802,
        },
        message: 'Foobar is nice',
        deployment: undefined,
        description: undefined,
      },
      2543452: {
        id: '2543452',
        hash: '0123456789abcdef',
        author: {
          name: undefined,
          email: 'juho@lucify.com',
          timestamp: 1470055881802,
        },
        committer: {
          name: undefined,
          email: 'juho@lucify.com',
          timestamp: 1470055881802,
        },
        message: 'Barbar barr barb aearr',
        deployment: undefined,
        description: undefined,
      },
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

    const successfulRequestAction = {
      type: Commits.actions.COMMIT.SUCCESS,
      response: testData.commitResponse.data,
    };

    const expectedSuccessfulRequestObject: CommitState = {
      aacceeff02: {
        id: 'aacceeff02',
        hash: '0123456789abcdef',
        author: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470066681802,
        },
        committer: {
          name: undefined,
          email: 'juho@lucify.com',
          timestamp: 1469800281802,
        },
        message: 'Fix colors',
        description: "The previous colors didn't look nice. Now they're much prettier.",
        deployment: '7',
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
      entities: testData.branchResponse.included!.slice(1, 2),
    };

    const expectedObjectsToStore: DeploymentState = {
      7: {
        id: '7',
        status: 'success',
        url: '#',
        screenshot: '#',
        creator: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470131481802,
        },
        commit: 'aacceeff02',
      },
    };

    const stateWithoutExistingEntity: DeploymentState = {
      8: {
        id: '8',
        status: 'success',
        url: '#',
        screenshot: '#',
        creator: {
          name: undefined,
          email: 'juho@lucify.com',
          timestamp: 1470131581802,
        },
        commit: '2543452',
      },
    };

    const stateWithExistingEntity: DeploymentState = {
      7: {
        id: '7',
        status: 'success',
        url: 'foo#',
        screenshot: 'bar#',
        creator: {
          name: 'Ville',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470131481802,
        },
        commit: '123468594',
      },
    };

    const successfulRequestAction = {
      type: Deployments.actions.DEPLOYMENT.SUCCESS,
      response: testData.deploymentResponse.data,
    };

    const expectedSuccessfulRequestObject: DeploymentState = {
      7: {
        id: '7',
        status: 'success',
        url: '#',
        screenshot: '#',
        creator: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470131481802,
        },
        commit: 'aacceeff02',
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
      entities: testData.allProjectsResponse.data,
    };

    const expectedObjectsToStore: ProjectState = {
      1: {
        id: '1',
        name: 'first-project',
        description: 'This is the first-project description. It might not be set.',
        activeUsers: [
          {
            name: 'Ville Saarinen',
            email: 'ville.saarinen@lucify.com',
            timestamp: 1470066681802,
          },
          {
            email: 'juho@lucify.com',
            name: undefined,
            timestamp: 1469800281802,
          },
        ],
        branches: ['1', '2', '3'],
      },
      2: {
        id: '2',
        name: 'second-project',
        description: undefined,
        activeUsers: [],
        branches: [],
      },
    };

    const stateWithoutExistingEntity: ProjectState = {
      3: {
        id: '3',
        name: 'Third project',
        description: undefined,
        activeUsers: [],
        branches: [],
      },
    };

    const stateWithExistingEntity: ProjectState = {
      3: {
        id: '3',
        name: 'Third project a',
        description: undefined,
        activeUsers: [
          {
            email: 'foo@bar.com',
            timestamp: 147001234532,
          },
        ],
        branches: [],
      },
      1: {
        id: '1',
        name: 'first-project again',
        description: 'foobar',
        activeUsers: [
          {
            email: 'foo@bar.com',
            timestamp: 147001334532,
          },
        ],
        branches: [],
      },
    };

    const successfulRequestAction = {
      type: Projects.actions.PROJECT.SUCCESS,
      response: testData.projectResponse.data,
    };

    const expectedSuccessfulRequestObject: ProjectState = {
      1: {
        id: '1',
        name: 'first-project',
        description: 'This is the first-project description. It might not be set.',
        activeUsers: [
          {
            name: 'Ville Saarinen',
            email: 'ville.saarinen@lucify.com',
            timestamp: 1470066681802,
          },
          {
            email: 'juho@lucify.com',
            name: undefined,
            timestamp: 1469800281802,
          },
        ],
        branches: ['1', '2', '3'],
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
      response: testData.allProjectsResponse.data,
    };

    const allProjectsObjects = expectedObjectsToStore;
    const expectedStateWithoutExistingEntity = Object.assign({}, stateWithoutExistingEntity, allProjectsObjects);
    const expectedStateWithExistingEntity = Object.assign({}, stateWithExistingEntity, allProjectsObjects);

    describe(`successful request all projects (${successfulAllProjectsRequestAction.type})`, () => {
      it('with an empty initial state', () => {
        expect(reducer(<any> undefined, successfulAllProjectsRequestAction)).to.deep.equal(allProjectsObjects);
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

    describe('project deletion', () => {
      it(`removes a project from the state upon receiving ${Projects.actions.SEND_DELETE_PROJECT.SUCCESS}`, () => {
        const action = {
          type: Projects.actions.SEND_DELETE_PROJECT.SUCCESS,
          id: 3,
        };
        const initialState = expectedStateWithExistingEntity;
        const expectedNewState = Object.assign({}, initialState);
        delete expectedNewState['3'];

        const newState = reducer(initialState, action);
        expect(newState).to.deep.equal(expectedNewState);
        expect(newState).to.not.equal(initialState);
      });

      it('does nothing if the project does not exist', () => {
        const action = {
          type: Projects.actions.SEND_DELETE_PROJECT.SUCCESS,
          id: 7,
        };
        const initialState = expectedStateWithExistingEntity;
        const newState = reducer(initialState, action);

        expect(newState).to.deep.equal(initialState);
        expect(newState).to.equal(initialState);
      });
    });
  });
});
