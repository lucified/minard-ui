import { expect } from 'chai';

import Requests from '../requests';
import { CLEAR_STORED_DATA } from '../user/index';
import {
  clearProjectDeletionErrors,
  clearSignupError,
  SIGNUP_ERROR,
  signupError,
} from './actions';
import reducer from './reducer';
import { ErrorState } from './types';

describe('Errors reducer', () => {
  it('adds error to an empty initial state', () => {
    const action = Requests.actions.Projects.LoadAllProjects.FAILURE.actionCreator(
      'projects fetch error',
      'detailed fetch error',
    );

    const expectedState = [action];

    const endState = reducer(undefined as any, action);

    expect(endState).to.deep.equal(expectedState);
  });

  it('adds error when requesting all projects fails', () => {
    const initialState: ErrorState = [
      {
        type: Requests.actions.Activities.LoadAllActivities.FAILURE.type,
        error: 'foobar error',
        details: 'detailed foobar error',
        prettyError: 'pretty foobar error',
      },
    ];

    const action = Requests.actions.Projects.LoadAllProjects.FAILURE.actionCreator(
      'projects fetch error',
      'detailed fetch error',
    );

    const expectedState = initialState.concat(action);

    const endState = reducer(initialState, action);

    expect(endState).to.deep.equal(expectedState);
    expect(endState).to.not.equal(initialState);
  });

  it('adds error when requesting activities fails', () => {
    const initialState: ErrorState = [
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'projects fetch error',
        details: 'detailed fetch error',
        prettyError: 'pretty error',
      },
    ];

    const action = Requests.actions.Activities.LoadAllActivities.FAILURE.actionCreator(
      'foobar error',
      'detailed foobar error',
    );

    const expectedState = initialState.concat(action);

    const endState = reducer(initialState, action);

    expect(endState).to.deep.equal(expectedState);
    expect(endState).to.not.equal(initialState);
  });

  it('adds error when signup fails', () => {
    const initialState: ErrorState = [
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'projects fetch error',
        details: 'detailed fetch error',
        prettyError: 'pretty error',
      },
    ];

    const action = signupError('signup error', 'detailed signup error');

    const expectedState = initialState.concat(action);

    const endState = reducer(initialState, action);

    expect(endState).to.deep.equal(expectedState);
    expect(endState).to.not.equal(initialState);
  });

  it('clears all projects fetching error when starting new request', () => {
    const initialState: ErrorState = [
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'projects fetch error',
        details: 'detailed fetch error',
        prettyError: 'pretty error',
      },
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'another projects fetch error',
        details: 'another detailed error',
        prettyError: 'another pretty error',
      },
      {
        type: Requests.actions.Activities.LoadAllActivities.FAILURE.type,
        error: 'foobar error',
        details: 'detailed foobar error',
        prettyError: 'pretty foobar error',
      },
    ];

    const action = Requests.actions.Projects.LoadAllProjects.REQUEST.actionCreator();

    const expectedState = initialState.slice(2);

    const endState = reducer(initialState, action);

    expect(endState).to.deep.equal(expectedState);
    expect(endState).to.not.equal(initialState);
  });

  it('clears activity fetching error when starting new request', () => {
    const initialState: ErrorState = [
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'projects fetch error',
        details: 'detailed fetch error',
        prettyError: 'pretty error',
      },
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'another projects fetch error',
        details: 'another detailed error',
        prettyError: 'another pretty error',
      },
      {
        type: Requests.actions.Activities.LoadAllActivities.FAILURE.type,
        error: 'foobar error',
        details: 'detailed foobar error',
        prettyError: 'pretty foobar error',
      },
    ];

    const action = Requests.actions.Activities.LoadAllActivities.REQUEST.actionCreator();

    const expectedState = initialState.slice(0, 2);

    const endState = reducer(initialState, action);

    expect(endState).to.deep.equal(expectedState);
    expect(endState).to.not.equal(initialState);
  });

  it('adds an error when deleting a project fails', () => {
    const initialState: ErrorState = [];
    const action = Requests.actions.Projects.DeleteProject.FAILURE.actionCreator(
      'foo',
      'failed',
      'detailed error\nhere',
    );
    const expectedState = [action];

    const newState = reducer(initialState, action);
    expect(newState).to.deep.equal(expectedState);
    expect(newState).to.not.equal(initialState);
  });

  it('clears the error when trying to delete a project again', () => {
    const initialState: ErrorState = [
      {
        type: Requests.actions.Projects.DeleteProject.FAILURE.type,
        id: 'foo',
        error: 'failed',
        details: 'detailed error\nhere',
        prettyError: 'failed',
      },
    ];
    const action = Requests.actions.Projects.DeleteProject.REQUEST.actionCreator(
      'foo',
    );
    const expectedState: any[] = [];

    const newState = reducer(initialState, action);
    expect(newState).to.deep.equal(expectedState);
    expect(newState).to.not.equal(initialState);
  });

  it(`clears all project deletion errors on clearProjectDeletionErrors`, () => {
    const initialState: ErrorState = [
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'projects fetch error',
        details: 'detailed fetch error',
        prettyError: 'pretty error',
      },
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'another projects fetch error',
        details: 'another detailed error',
        prettyError: 'another pretty error',
      },
      {
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
    const action = clearProjectDeletionErrors();
    const expectedState = [
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'projects fetch error',
        details: 'detailed fetch error',
        prettyError: 'pretty error',
      },
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'another projects fetch error',
        details: 'another detailed error',
        prettyError: 'another pretty error',
      },
      {
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

  it(`does nothing on clearProjectDeletionErrors when no deletion errors exist`, () => {
    const initialState: ErrorState = [
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'projects fetch error',
        details: 'detailed fetch error',
        prettyError: 'pretty error',
      },
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'another projects fetch error',
        details: 'another detailed error',
        prettyError: 'another pretty error',
      },
      {
        type: Requests.actions.Activities.LoadAllActivities.FAILURE.type,
        error: 'foobar error',
        details: 'detailed foobar error',
        prettyError: 'pretty foobar error',
      },
    ];
    const action = clearProjectDeletionErrors();
    const expectedState = initialState;

    const newState = reducer(initialState, action);
    expect(newState).to.deep.equal(expectedState);
    expect(newState).to.equal(initialState);
  });

  it(`clears all signup errors on clearSignupError`, () => {
    const initialState: ErrorState = [
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'projects fetch error',
        details: 'detailed fetch error',
        prettyError: 'pretty error',
      },
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'another projects fetch error',
        details: 'another detailed error',
        prettyError: 'another pretty error',
      },
      {
        type: SIGNUP_ERROR,
        error: 'signup error',
        details: 'detailed signup error',
        prettyError: 'pretty signup error',
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
    const action = clearSignupError();
    const expectedState = [
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'projects fetch error',
        details: 'detailed fetch error',
        prettyError: 'pretty error',
      },
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'another projects fetch error',
        details: 'another detailed error',
        prettyError: 'another pretty error',
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

    const newState = reducer(initialState, action);
    expect(newState).to.deep.equal(expectedState);
    expect(newState).to.not.equal(initialState);
  });

  it(`clears data on ${CLEAR_STORED_DATA}`, () => {
    const initialState: ErrorState = [
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'projects fetch error',
        details: 'detailed fetch error',
        prettyError: 'pretty error',
      },
      {
        type: Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        error: 'another projects fetch error',
        details: 'another detailed error',
        prettyError: 'another pretty error',
      },
      {
        type: Requests.actions.Activities.LoadAllActivities.FAILURE.type,
        error: 'foobar error',
        details: 'detailed foobar error',
        prettyError: 'pretty foobar error',
      },
    ];

    expect(reducer(initialState, { type: CLEAR_STORED_DATA })).to.deep.equal(
      [],
    );
    expect(
      reducer(undefined as any, { type: CLEAR_STORED_DATA }),
    ).to.deep.equal([]);
  });
});
