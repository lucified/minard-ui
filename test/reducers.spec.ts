import { expect } from 'chai';
import { Reducer } from 'redux';

import { ActivityState } from '../src/js/modules/activities';
import { BranchState } from '../src/js/modules/branches';
import Commits, { CommitState } from '../src/js/modules/commits';
import Deployments, { DeploymentState, DeploymentStatus } from '../src/js/modules/deployments';
import Errors, { DeleteError, ErrorState } from '../src/js/modules/errors';
import { FetchError } from '../src/js/modules/errors';
import Modal, { ModalType } from '../src/js/modules/modal';
import Projects, { ProjectState } from '../src/js/modules/projects';
import Requests, { RequestsState } from '../src/js/modules/requests';
import Selected, { SelectedState, SetSelectedAction } from '../src/js/modules/selected';

/*const testData = {
  allProjectsResponse: require('../json/projects.json') as ApiResponse,
  deploymentResponse: require('../json/deployment-7.json') as ApiResponse,
  branchResponse: require('../json/branch-1.json') as ApiResponse,
  commitResponse: require('../json/commit.json') as ApiResponse,
  projectResponse: require('../json/project-1.json') as ApiResponse,
  activitiesResponse: require('../json/activities.json') as ApiResponse,
  projectBranchesResponse: require('../json/project-1-branches.json') as ApiResponse,
  branchCommitsResponse: require('../json/branch-2-commits.json') as ApiResponse,
};
*/
type ModuleState = BranchState | CommitState | DeploymentState | ProjectState | ActivityState;
/*interface AnyAction extends Action {
  [field: string]: any;
};
*/
const testInitialState = (reducer: Reducer<ModuleState>, expectedState: ModuleState) => {
  it('returns the correct default state', () => {
    expect(reducer(<any> undefined, { type: 'foobar' })).to.deep.equal(expectedState);
  });
};

/*const testStoreEntities = (
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
};*/

const testReducer = (
  reducer: Reducer<ModuleState>,
  _storeAction: { type: string, entities: any },
  _expectedObjectsToStore: ModuleState,
  _stateWithoutExistingEntity: ModuleState,
  _stateWithExistingEntity: ModuleState,
  _failedRequestAction: FetchError,
) => {
  testInitialState(reducer, {});

  /* TODO
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
  */
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

    describe('requests module refactoring', () => {
      it('TODO: review these tests');
    });

    describe('fetch all projects', () => {
      it('stores request information', () => {
        const initialState: RequestsState = [];
        const action = {
          type: Requests.actions.Projects.LoadAllProjects.REQUEST.type,
        };
        const expectedState = [action];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request succeeds', () => {
        const initialState: RequestsState = [{
          type: Requests.actions.Projects.LoadAllProjects.REQUEST.type,
        }];
        const action = {
          type: Requests.actions.Projects.LoadAllProjects.SUCCESS.type,
        };
        const expectedState: any[] = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request fails', () => {
        const initialState: RequestsState = [{
          type: Requests.actions.Projects.LoadAllProjects.REQUEST.type,
        }];
        const action = {
          type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        };
        const expectedState: any[] = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });
    });

    describe('fetch all activities', () => {
      it('stores request information', () => {
        const initialState: RequestsState = [];
        const action = {
          type: Requests.actions.Activities.LoadAllActivities.REQUEST.type,
        };
        const expectedState = [action];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request succeeds', () => {
        const initialState: RequestsState = [{
          type: Requests.actions.Activities.LoadAllActivities.REQUEST.type,
        }];
        const action = {
          type: Requests.actions.Activities.LoadAllActivities.SUCCESS.type,
        };
        const expectedState: any[] = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request fails', () => {
        const initialState: RequestsState = [{
          type: Requests.actions.Activities.LoadAllActivities.REQUEST.type,
        }];
        const action = {
          type: Requests.actions.Activities.LoadAllActivities.FAILURE.type,
        };
        const expectedState: any[] = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });
    });

    describe('fetch all activities for project', () => {
      it('stores request information', () => {
        const initialState: RequestsState = [];
        const action = {
          type: Requests.actions.Activities.LoadActivitiesForProject.REQUEST.type,
          id: 'foo',
        };
        const expectedState = [action];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request succeeds', () => {
        const initialState: RequestsState = [{
          type: Requests.actions.Activities.LoadActivitiesForProject.REQUEST.type,
          id: 'foo',
        }];
        const action = {
          type: Requests.actions.Activities.LoadActivitiesForProject.SUCCESS.type,
          id: 'foo',
        };
        const expectedState: any[] = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request fails', () => {
        const initialState: RequestsState = [{
          type: Requests.actions.Activities.LoadActivitiesForProject.REQUEST.type,
          id: 'foo',
        }];
        const action = {
          type: Requests.actions.Activities.LoadActivitiesForProject.FAILURE.type,
          id: 'foo',
        };
        const expectedState: any[] = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });
    });

    describe('fetch all commits for branch', () => {
      it('stores request information', () => {
        const initialState: RequestsState = [];
        const action = {
          type: Requests.actions.Commits.LoadCommitsForBranch.REQUEST.type,
          id: 'foo',
        };
        const expectedState = [action];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request succeeds', () => {
        const initialState: RequestsState = [{
          type: Requests.actions.Commits.LoadCommitsForBranch.REQUEST.type,
          id: 'foo',
        }];
        const action = {
          type: Requests.actions.Commits.LoadCommitsForBranch.SUCCESS.type,
          id: 'foo',
        };
        const expectedState: any[] = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request fails', () => {
        const initialState: RequestsState = [{
          type: Requests.actions.Commits.LoadCommitsForBranch.REQUEST.type,
          id: 'foo',
        }];
        const action = {
          type: Requests.actions.Commits.LoadCommitsForBranch.FAILURE.type,
          id: 'foo',
        };
        const expectedState: any[] = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });
    });

    describe('delete project', () => {
      it('stores request information', () => {
        const initialState: RequestsState = [];
        const action = {
          type: Requests.actions.Projects.DeleteProject.REQUEST.type,
          id: 'foo',
        };
        const expectedState = [action];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request succeeds', () => {
        const initialState: RequestsState = [{
          type: Requests.actions.Projects.DeleteProject.REQUEST.type,
          id: 'foo',
        }];
        const action = {
          type: Requests.actions.Projects.DeleteProject.SUCCESS.type,
          id: 'foo',
        };
        const expectedState: any[] = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });

      it('removes request information once request fails', () => {
        const initialState: RequestsState = [{
          type: Requests.actions.Projects.DeleteProject.REQUEST.type,
          id: 'foo',
        }];
        const action = {
          type: Requests.actions.Projects.DeleteProject.FAILURE.type,
          id: 'foo',
        };
        const expectedState: any[] = [];

        const endState = reducer(initialState, action);

        expect(endState).to.deep.equal(expectedState);
        expect(endState).to.not.equal(initialState);
      });
    });
  });

  describe('selected', () => {
    const { reducer } = Selected;

    it('adds selected project and branch to empty state', () => {
      const action: SetSelectedAction = {
        type: Selected.actions.SET_SELECTED,
        project: 'p',
        branch: 'b',
        showAll: false,
      };

      const expectedState: SelectedState = {
        project: 'p',
        branch: 'b',
        showAll: false,
      };

      const endState: SelectedState = reducer(<any> undefined, action);

      expect(endState).to.deep.equal(expectedState);
    });

    it('it replaces existing selections', () => {
      const action: SetSelectedAction = {
        type: Selected.actions.SET_SELECTED,
        project: 'p',
        branch: 'b',
        showAll: true,
      };

      const initialState: SelectedState = {
        project: 'p2',
        branch: 'b2',
        showAll: false,
      };

      const expectedState: SelectedState = {
        project: 'p',
        branch: 'b',
        showAll: true,
      };

      const endState: SelectedState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('it clears existing selections', () => {
      const action: SetSelectedAction = {
        type: Selected.actions.SET_SELECTED,
        project: null,
        branch: null,
        showAll: false,
      };

      const initialState: SelectedState = {
        project: 'p2',
        branch: 'b',
        showAll: true,
      };

      const expectedState: SelectedState = {
        project: null,
        branch: null,
        showAll: false,
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
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        id: null,
        error: 'projects fetch error',
        details: 'detailed fetch error',
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
          type: Requests.actions.Activities.LoadAllActivities.FAILURE.type,
          error: 'foobar error',
          details: 'detailed foobar error',
          prettyError: 'pretty foobar error',
        },
      ];

      const action: any = {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        id: null,
        error: 'projects fetch error',
        details: 'detailed fetch error',
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
          type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
          id: null,
          error: 'projects fetch error',
          details: 'detailed fetch error',
          prettyError: 'pretty error',
        },
      ];

      const action: any = {
        id: null,
        type: Requests.actions.Activities.LoadAllActivities.FAILURE.type,
        error: 'foobar error',
        details: 'detailed foobar error',
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
          type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
          id: null,
          error: 'projects fetch error',
          details: 'detailed fetch error',
          prettyError: 'pretty error',
        },
        {
          type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
          id: null,
          error: 'another projects fetch error',
          details: 'another detailed error',
          prettyError: 'another pretty error',
        },
        {
          id: null,
          type: Requests.actions.Activities.LoadAllActivities.FAILURE.type,
          error: 'foobar error',
          details: 'detailed foobar error',
          prettyError: 'pretty foobar error',
        },
      ];

      const action: any = {
        type: Requests.actions.Projects.LoadAllProjects.REQUEST.type,
      };

      const expectedState = initialState.slice(2);

      const endState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('clears activity fetching error when starting new request', () => {
      const initialState: ErrorState = [
        {
          type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
          id: null,
          error: 'projects fetch error',
          details: 'detailed fetch error',
          prettyError: 'pretty error',
        },
        {
          type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
          id: null,
          error: 'another projects fetch error',
          details: 'another detailed error',
          prettyError: 'another pretty error',
        },
        {
          id: null,
          type: Requests.actions.Activities.LoadAllActivities.FAILURE.type,
          error: 'foobar error',
          details: 'detailed foobar error',
          prettyError: 'pretty foobar error',
        },
      ];

      const action: any = {
        type: Requests.actions.Activities.LoadAllActivities.REQUEST.type,
      };

      const expectedState = initialState.slice(0, 2);

      const endState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('adds an error when deleting a project fails', () => {
      const initialState: ErrorState = [];
      const action: DeleteError = {
        type: Requests.actions.Projects.DeleteProject.FAILURE.type,
        id: 'foo',
        error: 'failed',
        details: 'detailed error\nhere',
        prettyError: 'failed',
      };
      const expectedState = [action];

      const newState = reducer(initialState, action);
      expect(newState).to.deep.equal(expectedState);
      expect(newState).to.not.equal(initialState);
    });

    it('clears the error when trying to delete a project again', () => {
      const initialState: ErrorState = [{
        type: Requests.actions.Projects.DeleteProject.FAILURE.type,
        id: 'foo',
        error: 'failed',
        details: 'detailed error\nhere',
        prettyError: 'failed',
      }];
      const action = {
        type: Requests.actions.Projects.DeleteProject.REQUEST.type,
        id: 'foo',
      };
      const expectedState: any[] = [];

      const newState = reducer(initialState, action);
      expect(newState).to.deep.equal(expectedState);
      expect(newState).to.not.equal(initialState);
    });

    it(`clears all project deletion errors on ${Errors.actions.CLEAR_PROJECT_DELETION_ERRORS}`, () => {
      const initialState: ErrorState = [
        {
          type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
          id: null,
          error: 'projects fetch error',
          details: 'detailed fetch error',
          prettyError: 'pretty error',
        },
        {
          type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
          id: null,
          error: 'another projects fetch error',
          details: 'another detailed error',
          prettyError: 'another pretty error',
        },
        {
          id: null,
          type: Requests.actions.Activities.LoadAllActivities.FAILURE.type,
          error: 'foobar error',
          details: 'detailed foobar error',
          prettyError: 'pretty foobar error',
        },
        {
          type: Requests.actions.Projects.DeleteProject.FAILURE.type,
          id: 'foo',
          error: 'failed',
          details: 'detailed error\nhere',
          prettyError: 'failed',
        },
        {
          type: Requests.actions.Projects.DeleteProject.FAILURE.type,
          id: 'bar',
          error: 'failed',
          details: 'detailed error\nhere',
          prettyError: 'failed',
        },
      ];
      const action = {
        type: Errors.actions.CLEAR_PROJECT_DELETION_ERRORS,
      };
      const expectedState = [
        {
          type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
          id: null,
          error: 'projects fetch error',
          details: 'detailed fetch error',
          prettyError: 'pretty error',
        },
        {
          type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
          id: null,
          error: 'another projects fetch error',
          details: 'another detailed error',
          prettyError: 'another pretty error',
        },
        {
          id: null,
          type: Requests.actions.Activities.LoadAllActivities.FAILURE.type,
          error: 'foobar error',
          details: 'detailed foobar error',
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
          type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
          id: null,
          error: 'projects fetch error',
          details: 'detailed fetch error',
          prettyError: 'pretty error',
        },
        {
          type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
          id: null,
          error: 'another projects fetch error',
          details: 'another detailed error',
          prettyError: 'another pretty error',
        },
        {
          id: null,
          type: Requests.actions.Activities.LoadAllActivities.FAILURE.type,
          error: 'foobar error',
          details: 'detailed foobar error',
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

  describe('branches', () => {
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

  describe('commits', () => {
    const { reducer } = Commits;

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
      type: Commits.actions.STORE_COMMITS,
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
    );

    describe('adding a deployment to a commit', () => {
      it('TODO');
    });
  });

  describe('deployments', () => {
    const { reducer } = Deployments;

    const expectedObjectsToStore: DeploymentState = {
      7: {
        id: '7',
        status: DeploymentStatus.Success,
        url: '#',
        screenshot: 'https://www.lucify.com/images/lucify-asylum-countries-open-graph-size-5adef1be36.png',
        creator: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470131481802,
        },
      },
    };

    const storeAction = {
      type: Deployments.actions.STORE_DEPLOYMENTS,
      entities: expectedObjectsToStore,
    };

    const stateWithoutExistingEntity: DeploymentState = {
      8: {
        id: '8',
        status: DeploymentStatus.Success,
        url: '#',
        screenshot: 'https://www.lucify.com/images/lucify-asylum-countries-open-graph-size-5adef1be36.png',
        creator: {
          name: undefined,
          email: 'juho@lucify.com',
          timestamp: 1470131581802,
        },
      },
    };

    const stateWithExistingEntity: DeploymentState = {
      7: {
        id: '7',
        status: DeploymentStatus.Success,
        url: 'foo#',
        screenshot: 'bar#',
        creator: {
          name: 'Ville',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470131481802,
        },
      },
    };

    const failedRequestObject: FetchError = {
      id: '7',
      type: Requests.actions.Deployments.LoadDeployment.FAILURE.type,
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
    );
  });

  describe('projects', () => {
    const { reducer } = Projects;

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
      },
    };

    const storeAction = {
      type: Projects.actions.STORE_PROJECTS,
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
      },
    };

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
      },
    };

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
    );

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

  describe('streaming', () => {
    it('TODO');
  });
});
