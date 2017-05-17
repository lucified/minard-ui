import { expect } from 'chai';

import Requests from '../requests';
import { CLEAR_PROJECT_DELETION_ERRORS } from './actions';
import reducer from './reducer';
import { DeleteError, ErrorState, FetchCollectionError } from './types';

describe('Errors reducer', () => {
  it('adds error to an empty initial state', () => {
    const action: FetchCollectionError = {
      type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
      error: 'projects fetch error',
      details: 'detailed fetch error',
      prettyError: 'pretty error',
    };

    const expectedState = [action];

    const endState = reducer(undefined as any, action);

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

    const action: FetchCollectionError = {
      type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
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

    const action: FetchCollectionError = {
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

  it(`clears all project deletion errors on ${CLEAR_PROJECT_DELETION_ERRORS}`, () => {
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
      type: CLEAR_PROJECT_DELETION_ERRORS,
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

  it(`does nothing on ${CLEAR_PROJECT_DELETION_ERRORS} when no deletion errors exist`, () => {
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
      type: CLEAR_PROJECT_DELETION_ERRORS,
    };
    const expectedState = initialState;

    const newState = reducer(initialState, action);
    expect(newState).to.deep.equal(expectedState);
    expect(newState).to.equal(initialState);
  });
});
