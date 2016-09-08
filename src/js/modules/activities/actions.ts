import * as t from './types';

export const LOAD_ACTIVITIES = 'ACTIVITIES/LOAD_ACTIVITIES';
export const loadActivities = (): t.LoadActivitiesAction => ({
  type: LOAD_ACTIVITIES,
});

export const LOAD_ACTIVITIES_FOR_PROJECT = 'ACTIVITIES/LOAD_ACTIVITIES_FOR_PROJECT';
export const loadActivitiesForProject = (id: string): t.LoadActivitiesForProjectAction => ({
  type: LOAD_ACTIVITIES_FOR_PROJECT,
  id,
});

export const STORE_ACTIVITIES = 'ACTIVITIES/STORE_ACTIVITIES';
export const storeActivities = (activities: t.Activity[]): t.StoreActivitiesAction => ({
  type: STORE_ACTIVITIES,
  entities: activities,
});
