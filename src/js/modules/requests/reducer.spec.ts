import { expect } from 'chai';

import { Activities, Commits, Projects } from './actions';
import reducer from './reducer';
import { RequestsState } from './types';

describe('Requests reducer', () => {
  describe('requests module refactoring', () => {
    it('TODO: review these tests');
  });

  describe('fetch all projects', () => {
    it('stores request information', () => {
      const initialState: RequestsState = [];
      const action = {
        type: Projects.LoadAllProjects.REQUEST.type,
      };
      const expectedState = [action];

      const endState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('removes request information once request succeeds', () => {
      const initialState: RequestsState = [{
        type: Projects.LoadAllProjects.REQUEST.type,
      }];
      const action = {
        type: Projects.LoadAllProjects.SUCCESS.type,
      };
      const expectedState: any[] = [];

      const endState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('removes request information once request fails', () => {
      const initialState: RequestsState = [{
        type: Projects.LoadAllProjects.REQUEST.type,
      }];
      const action = {
        type: Projects.LoadAllProjects.FAILURE.type,
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
        type: Activities.LoadAllActivities.REQUEST.type,
      };
      const expectedState = [action];

      const endState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('removes request information once request succeeds', () => {
      const initialState: RequestsState = [{
        type: Activities.LoadAllActivities.REQUEST.type,
      }];
      const action = {
        type: Activities.LoadAllActivities.SUCCESS.type,
      };
      const expectedState: any[] = [];

      const endState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('removes request information once request fails', () => {
      const initialState: RequestsState = [{
        type: Activities.LoadAllActivities.REQUEST.type,
      }];
      const action = {
        type: Activities.LoadAllActivities.FAILURE.type,
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
        type: Activities.LoadActivitiesForProject.REQUEST.type,
        id: 'foo',
      };
      const expectedState = [action];

      const endState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('removes request information once request succeeds', () => {
      const initialState: RequestsState = [{
        type: Activities.LoadActivitiesForProject.REQUEST.type,
        id: 'foo',
      }];
      const action = {
        type: Activities.LoadActivitiesForProject.SUCCESS.type,
        id: 'foo',
      };
      const expectedState: any[] = [];

      const endState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('removes request information once request fails', () => {
      const initialState: RequestsState = [{
        type: Activities.LoadActivitiesForProject.REQUEST.type,
        id: 'foo',
      }];
      const action = {
        type: Activities.LoadActivitiesForProject.FAILURE.type,
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
        type: Commits.LoadCommitsForBranch.REQUEST.type,
        id: 'foo',
      };
      const expectedState = [action];

      const endState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('removes request information once request succeeds', () => {
      const initialState: RequestsState = [{
        type: Commits.LoadCommitsForBranch.REQUEST.type,
        id: 'foo',
      }];
      const action = {
        type: Commits.LoadCommitsForBranch.SUCCESS.type,
        id: 'foo',
      };
      const expectedState: any[] = [];

      const endState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('removes request information once request fails', () => {
      const initialState: RequestsState = [{
        type: Commits.LoadCommitsForBranch.REQUEST.type,
        id: 'foo',
      }];
      const action = {
        type: Commits.LoadCommitsForBranch.FAILURE.type,
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
        type: Projects.DeleteProject.REQUEST.type,
        id: 'foo',
      };
      const expectedState = [action];

      const endState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('removes request information once request succeeds', () => {
      const initialState: RequestsState = [{
        type: Projects.DeleteProject.REQUEST.type,
        id: 'foo',
      }];
      const action = {
        type: Projects.DeleteProject.SUCCESS.type,
        id: 'foo',
      };
      const expectedState: any[] = [];

      const endState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });

    it('removes request information once request fails', () => {
      const initialState: RequestsState = [{
        type: Projects.DeleteProject.REQUEST.type,
        id: 'foo',
      }];
      const action = {
        type: Projects.DeleteProject.FAILURE.type,
        id: 'foo',
      };
      const expectedState: any[] = [];

      const endState = reducer(initialState, action);

      expect(endState).to.deep.equal(expectedState);
      expect(endState).to.not.equal(initialState);
    });
  });
});
