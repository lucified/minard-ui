// tslint:disable:no-object-literal-type-assertion

import { expect } from 'chai';
import { call, fork, put, select } from 'redux-saga/effects';

import { toActivities } from '../../api/convert';
import { ResponseActivityElement } from '../../api/types';
import { createApi, testData } from '../../sagas/test-utils';
import Requests from '../requests';
import Activities, { LoadActivitiesAction, LoadActivitiesForProjectAction } from './index';
import createSagas from './sagas';

describe('Activities sagas', () => {
  const api = createApi();
  const sagaFunctions = createSagas(api).functions;

  describe('loadActivities', () => {
    const teamId = '1';
    const action: LoadActivitiesAction = {
      type: Activities.actions.LOAD_ACTIVITIES,
      teamId,
      count: 10,
      until: 283751293,
    };

    it('fetches activities and ensures data', () => {
      const iterator = sagaFunctions.loadActivities(action);

      expect(iterator.next().value).to.deep.equal(
        call(sagaFunctions.fetchActivities, teamId, action.count, action.until),
      );

      expect(iterator.next(true).value).to.deep.equal(
        fork(sagaFunctions.ensureActivitiesRelatedDataLoaded),
      );

      expect(iterator.next().done).to.equal(true);
    });

    it('does not ensure data if fetching fails', () => {
      const iterator = sagaFunctions.loadActivities(action);

      expect(iterator.next().value).to.deep.equal(
        call(sagaFunctions.fetchActivities, teamId, action.count, action.until),
      );

      expect(iterator.next(false).done).to.equal(true);
    });
  });

  describe('loadActivitiesForProject', () => {
    const id = 'id';
    const count = 10;
    const until = undefined;
    const action: LoadActivitiesForProjectAction = {
      type: Activities.actions.LOAD_ACTIVITIES_FOR_PROJECT,
      id,
      count,
      until,
    };

    it('fetches projects and ensures data', () => {
      const iterator = sagaFunctions.loadActivitiesForProject(action);

      expect(iterator.next().value).to.deep.equal(
        select(Requests.selectors.isLoadingActivitiesForProject, id),
      );

      expect(iterator.next(false).value).to.deep.equal(
        call(sagaFunctions.fetchActivitiesForProject, id, count, until),
      );

      expect(iterator.next(true).value).to.deep.equal(
        fork(sagaFunctions.ensureActivitiesRelatedDataLoaded),
      );

      expect(iterator.next().done).to.equal(true);
    });

    it('does not ensure data if fetching fails', () => {
      const iterator = sagaFunctions.loadActivitiesForProject(action);

      expect(iterator.next().value).to.deep.equal(
        select(Requests.selectors.isLoadingActivitiesForProject, id),
      );

      expect(iterator.next(false).value).to.deep.equal(
        call(sagaFunctions.fetchActivitiesForProject, id, count, until),
      );

      expect(iterator.next(false).done).to.equal(true);
    });
  });

  describe('fetchActivities', () => {
    const teamId = 'foo';

    it('fetches, converts and stores all activities', () => {
      const response = testData.activitiesResponse;
      const objects = [{ id: '1' }, { id: '2' }];
      const until = 12523523623;
      const count = objects.length;
      const iterator = sagaFunctions.fetchActivities(teamId, count, until);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Activities.LoadAllActivities.REQUEST.actionCreator()),
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Activity.fetchAll, teamId, count, until),
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        call(toActivities, response.data as ResponseActivityElement[]),
      );

      expect(iterator.next(objects).value).to.deep.equal(
        put(Activities.actions.storeActivities(objects as any)),
      );

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Activities.LoadAllActivities.SUCCESS.actionCreator()),
      );

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('saves information that all activities have been requested if fewer than count are received', () => {
      const count = 10;
      const until = 12523523623;
      const response = testData.activitiesResponse;
      const iterator = sagaFunctions.fetchActivities(teamId, count, until);
      const objects = [{ id: '1' }, { id: '2' }];

      iterator.next(); // request action
      iterator.next(); // API call
      iterator.next({ response }); // convert
      iterator.next(objects); // store

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.allActivitiesRequested()),
      );

      iterator.next();

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('does not save information that all activities have been requested if count activities are received', () => {
      const response = testData.activitiesResponse;
      const objects = [{ id: '1' }, { id: '2' }];
      const count = objects.length;
      const until = undefined;
      const iterator = sagaFunctions.fetchActivities(teamId, count, until);

      iterator.next(); // request action
      iterator.next(); // API call
      iterator.next({ response }); // request success
      iterator.next(objects); // convert
      iterator.next(); // store

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('throws an error on failure', () => {
      const count = 10;
      const until = 12523523623;
      const errorMessage = 'an error message';
      const iterator = sagaFunctions.fetchActivities(teamId, count, until);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Activities.LoadAllActivities.REQUEST.actionCreator()),
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Activity.fetchAll, teamId, count, until),
      );

      expect(iterator.next({ error: errorMessage }).value).to.deep.equal(
        put(Requests.actions.Activities.LoadAllActivities.FAILURE.actionCreator(errorMessage)),
      );

      const result = iterator.next();

      expect(result.value).to.equal(false);
      expect(result.done).to.equal(true);
    });
  });

  describe('fetchActivitiesForProject', () => {
    const id = 'id';

    it('fetches, converts and stores activities', () => {
      const response = testData.activitiesResponse;
      const objects = [{ id: '1' }, { id: '2' }];
      const count = objects.length;
      const until = undefined;
      const iterator = sagaFunctions.fetchActivitiesForProject(id, count, until);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Activities.LoadActivitiesForProject.REQUEST.actionCreator(id)),
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Activity.fetchAllForProject, id, count, until),
      );

      expect(iterator.next({ response }).value).to.deep.equal(
        call(toActivities, response.data as ResponseActivityElement[]),
      );

      expect(iterator.next(objects).value).to.deep.equal(
        put(Activities.actions.storeActivities(objects as any)),
      );

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Activities.LoadActivitiesForProject.SUCCESS.actionCreator(id)),
      );

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('saves information that all activities have been requested if fewer than count are received', () => {
      const response = testData.activitiesResponse;
      const count = 10;
      const until = 51246243;
      const iterator = sagaFunctions.fetchActivitiesForProject(id, count, until);
      const objects = [{ id: '1' }, { id: '2' }];

      iterator.next(); // request action
      iterator.next(); // API call
      iterator.next({ response });
      iterator.next(objects); // store

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.allActivitiesRequestedForProject(id)),
      );

      iterator.next();

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('does not save information that all activities have been requested if count activities are received', () => {
      const response = testData.activitiesResponse;
      const objects = [{ id: '1' }, { id: '2' }];
      const count = objects.length;
      const until = undefined;
      const iterator = sagaFunctions.fetchActivitiesForProject(id, count, until);

      iterator.next(); // request action
      iterator.next(); // API call
      iterator.next({ response }); // request success
      iterator.next(objects); // convert
      iterator.next(); // store

      const result = iterator.next();

      expect(result.value).to.equal(true);
      expect(result.done).to.equal(true);
    });

    it('throws an error on failure', () => {
      const count = 10;
      const until = undefined;
      const errorMessage = 'an error message';
      const iterator = sagaFunctions.fetchActivitiesForProject(id, count, until);

      expect(iterator.next().value).to.deep.equal(
        put(Requests.actions.Activities.LoadActivitiesForProject.REQUEST.actionCreator(id)),
      );

      expect(iterator.next().value).to.deep.equal(
        call(api.Activity.fetchAllForProject, id, count, until),
      );

      expect(iterator.next({ error: errorMessage }).value).to.deep.equal(
        put(Requests.actions.Activities.LoadActivitiesForProject.FAILURE.actionCreator(id, errorMessage)),
      );

      const result = iterator.next();

      expect(result.value).to.equal(false);
      expect(result.done).to.equal(true);
    });
  });

  describe('ensureActivitiesRelatedDataLoaded', () => {
    it('does nothing', () => {
      const iterator = sagaFunctions.ensureActivitiesRelatedDataLoaded();

      expect(iterator.next().done).to.equal(true);
    });
  });
});
