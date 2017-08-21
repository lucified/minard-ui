import { expect } from 'chai';

import { CLEAR_STORED_DATA } from '../user/index';

import {
  Activities,
  ALL_ACTIVITIES_REQUESTED,
  ALL_ACTIVITIES_REQUESTED_FOR_PROJECT,
  Comments,
  Commits,
  Projects,
  Team,
} from './actions';
import reducer from './reducer';
import { RequestsState } from './types';

describe('Requests reducer', () => {
  describe('request started', () => {
    const requestStartedTypes = [
      Projects.LoadAllProjects.REQUEST.type,
      Projects.DeleteProject.REQUEST.type,
      Activities.LoadAllActivities.REQUEST.type,
      Activities.LoadActivitiesForProject.REQUEST.type,
      Commits.LoadCommitsForBranch.REQUEST.type,
      Comments.LoadCommentsForDeployment.REQUEST.type,
      Comments.DeleteComment.REQUEST.type,
      Team.LoadTeamInformation.REQUEST.type,
      ALL_ACTIVITIES_REQUESTED,
      ALL_ACTIVITIES_REQUESTED_FOR_PROJECT,
    ];

    requestStartedTypes.forEach(type => {
      it(`stores information about started request for ${type}`, () => {
        const initialState: RequestsState = [];
        const action = { type }; // NOTE: this is not the full action
        const newState = reducer(initialState, action);
        expect(newState).to.contain(action);
        expect(newState).to.not.equal(initialState);
      });
    });
  });

  describe('request completed', () => {
    const entityTypesWithoutId = [
      Projects.LoadAllProjects,
      Activities.LoadAllActivities,
      Team.LoadTeamInformation,
    ];

    entityTypesWithoutId.forEach(entityType => {
      const initialState: RequestsState = [{ type: entityType.REQUEST.type }];

      it(`clears request information on successful completion (${entityType
        .SUCCESS.type})`, () => {
        const action = entityType.SUCCESS.actionCreator();
        const newState = reducer(initialState, action);
        expect(newState).to.deep.equal([]);
        expect(newState).to.not.equal(initialState);
      });

      it(`clears request information on failed completion (${entityType.FAILURE
        .type})`, () => {
        const action = entityType.FAILURE.actionCreator('error');
        const newState = reducer(initialState, action);
        expect(newState).to.deep.equal([]);
        expect(newState).to.not.equal(initialState);
      });
    });

    const entityTypesWithIds = [
      Projects.DeleteProject,
      Activities.LoadActivitiesForProject,
      Commits.LoadCommitsForBranch,
      Comments.LoadCommentsForDeployment,
      Comments.DeleteComment,
    ];

    entityTypesWithIds.forEach(entityType => {
      const id = 'id';
      const initialState: RequestsState = [
        { type: entityType.REQUEST.type, id },
      ];

      it(`clears request information on successful completion (${entityType
        .SUCCESS.type})`, () => {
        const action = entityType.SUCCESS.actionCreator(id);
        const newState = reducer(initialState, action);
        expect(newState).to.deep.equal([]);
        expect(newState).to.not.equal(initialState);
      });

      it(`clears request information on failed completion (${entityType.FAILURE
        .type})`, () => {
        const action = entityType.FAILURE.actionCreator(id, 'error');
        const newState = reducer(initialState, action);
        expect(newState).to.deep.equal([]);
        expect(newState).to.not.equal(initialState);
      });
    });
  });

  it(`clears data on ${CLEAR_STORED_DATA}`, () => {
    const initialState: RequestsState = [
      {
        type: Projects.DeleteProject.REQUEST.type,
        id: 'foo',
      },
    ];
    const action = { type: CLEAR_STORED_DATA };
    expect(reducer(initialState, action)).to.deep.equal([]);
    expect(reducer(undefined as any, action)).to.deep.equal([]);
  });
});
