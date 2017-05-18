import { expect } from 'chai';
import { LOCATION_CHANGE } from 'react-router-redux';

import { CLEAR_STORED_DATA } from '../user';
import reducer from './reducer';
import { SelectedState } from './types';

describe('Selected reducer', () => {
  it('adds selected project and branch to empty state', () => {
    const action = {
      type: LOCATION_CHANGE,
      payload: {
        pathname: '/project/11/branch/11-master',
      },
    };

    const expectedState: SelectedState = {
      project: '11',
      branch: '11-master',
      showAll: false,
    };

    const endState: SelectedState = reducer(undefined as any, action);

    expect(endState).to.deep.equal(expectedState);
  });

  it('replaces existing selections', () => {
    const action = {
      type: LOCATION_CHANGE,
      payload: {
        pathname: '/project/12/branch/12-master',
      },
    };

    const initialState: SelectedState = {
      project: 'p2',
      branch: 'b2',
      showAll: false,
    };

    const expectedState: SelectedState = {
      project: '12',
      branch: '12-master',
      showAll: false,
    };

    const endState: SelectedState = reducer(initialState, action);

    expect(endState).to.deep.equal(expectedState);
    expect(endState).to.not.equal(initialState);
  });

  it('parses Show all correctly in the Team Projects View', () => {
    const action = {
      type: LOCATION_CHANGE,
      payload: {
        pathname: '/projects/all',
      },
    };

    const initialState: SelectedState = {
      project: 'p2',
      branch: 'b2',
      showAll: false,
    };

    const expectedState: SelectedState = {
      project: null,
      branch: null,
      showAll: true,
    };

    const endState: SelectedState = reducer(initialState, action);

    expect(endState).to.deep.equal(expectedState);
    expect(endState).to.not.equal(initialState);
  });

  it('parses Show all correctly in the Project View', () => {
    const action = {
      type: LOCATION_CHANGE,
      payload: {
        pathname: '/project/66/all',
      },
    };

    const initialState: SelectedState = {
      project: '66',
      branch: null,
      showAll: false,
    };

    const expectedState: SelectedState = {
      project: '66',
      branch: null,
      showAll: true,
    };

    const endState: SelectedState = reducer(initialState, action);

    expect(endState).to.deep.equal(expectedState);
    expect(endState).to.not.equal(initialState);
  });

  it('clears existing selections', () => {
    const action = {
      type: LOCATION_CHANGE,
      payload: {
        pathname: '',
      },
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

  it('returns empty for unknown locations', () => {
    const action = {
      type: LOCATION_CHANGE,
      payload: {
        pathname: '/asfasd/fahgasfa/adasd',
      },
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

  it(`clears data on ${CLEAR_STORED_DATA}`, () => {
    const initialState: SelectedState = {
      project: 'p2',
      branch: 'b',
      showAll: true,
    };
    expect(reducer(initialState, { type: CLEAR_STORED_DATA })).to.deep.equal({});
    expect(reducer(undefined as any, { type: CLEAR_STORED_DATA })).to.deep.equal({});
  });
});
