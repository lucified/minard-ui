import { expect } from 'chai';

import { FetchError } from '../errors';
import Requests from '../requests';
import { CLEAR_STORED_DATA } from '../user';
import { storePreview } from './actions';
import reducer from './reducer';
import { Preview, PreviewState } from './types';

describe('Previews reducer', () => {
  const stateWithExistingEntity: PreviewState = {
    'branch-7-1': {
      commit: 'existingCommit',
      deployment: 'existingDeployment',
      project: {
        id: '7',
        name: 'projectname',
      },
      branch: {
        id: '1',
        name: 'branchname',
      },
    },
  };

  const stateWithoutExistingEntity: PreviewState = {
    'project-7': {
      commit: 'existingCommit2',
      deployment: 'existingDeployment2',
      project: {
        id: '7',
        name: 'projectname',
      },
      branch: {
        id: 'branchid2',
        name: 'branchname2',
      },
    },
  };

  it('returns the correct default state', () => {
    expect(reducer(undefined as any, { type: 'foobar' })).to.deep.equal({});
  });

  describe('storePreviews', () => {
    const newPreview: PreviewState = {
      'branch-7-1': {
        commit: 'existingCommit3',
        deployment: 'existingDeployment3',
        project: {
          id: '7',
          name: 'projectname',
        },
        branch: {
          id: '1',
          name: 'branchname',
        },
      },
    };

    const storeAction = storePreview(newPreview['branch-7-1'] as Preview, '7-1', 'branch');

    it('with an empty initial state', () => {
      expect(reducer(undefined as any, storeAction)).to.deep.equal(newPreview);
    });

    it('with other previews in state', () => {
      const newState = reducer(stateWithoutExistingEntity, storeAction);
      expect(newState).to.deep.equal({ ...stateWithoutExistingEntity, ...newPreview});
      expect(newState).to.not.equal(stateWithoutExistingEntity); // make sure not mutated
    });

    it('by replacing existing previews', () => {
      const newState = reducer(stateWithExistingEntity, storeAction);
      expect(newState).to.deep.equal({ ...stateWithExistingEntity, ...newPreview });
      expect(newState).to.not.equal(stateWithExistingEntity); // make sure not mutated
    });
  });

  describe('failed fetch preview request', () => {
    const failedRequestAction: FetchError = {
      id: 'branch-7-1',
      type: Requests.actions.Previews.LoadPreview.FAILURE.type,
      error: 'Error message in testing',
      details: 'Detailed message in testing',
      prettyError: 'Pretty error message in testing',
    };

    it('with an empty initial state', () => {
      expect(reducer(undefined as any, failedRequestAction)).to.deep.equal(
        { [failedRequestAction.id]: failedRequestAction },
      );
    });

    it('with other entities in state', () => {
      const newState = reducer(stateWithoutExistingEntity, failedRequestAction);
      expect(newState).to.deep.equal(
        { ...stateWithoutExistingEntity, [failedRequestAction.id]: failedRequestAction },
      );
      expect(newState).to.not.equal(stateWithoutExistingEntity); // make sure not mutated
    });

    it('by not overwriting existing entities', () => {
      const newState = reducer(stateWithExistingEntity, failedRequestAction);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity); // make sure not mutated
    });
  });

  it(`clears data on ${CLEAR_STORED_DATA}`, () => {
    expect(reducer(stateWithExistingEntity, { type: CLEAR_STORED_DATA })).to.deep.equal({});
    expect(reducer(stateWithoutExistingEntity, { type: CLEAR_STORED_DATA })).to.deep.equal({});
    expect(reducer(undefined as any, { type: CLEAR_STORED_DATA })).to.deep.equal({});
  });
});
