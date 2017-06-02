import {
  Activity,
  LoadActivitiesAction,
  LoadActivitiesForProjectAction,
  StoreActivitiesAction,
} from './types';

export const LOAD_ACTIVITIES = 'ACTIVITIES/LOAD_ACTIVITIES';
export const loadActivities = (
  teamId: string,
  count: number,
  until?: number,
): LoadActivitiesAction => ({
  type: LOAD_ACTIVITIES,
  teamId,
  count,
  until,
});

export const LOAD_ACTIVITIES_FOR_PROJECT =
  'ACTIVITIES/LOAD_ACTIVITIES_FOR_PROJECT';
export const loadActivitiesForProject = (
  id: string,
  count: number,
  until?: number,
): LoadActivitiesForProjectAction => ({
  type: LOAD_ACTIVITIES_FOR_PROJECT,
  id,
  count,
  until,
});

export const STORE_ACTIVITIES = 'ACTIVITIES/STORE_ACTIVITIES';
export const storeActivities = (
  activities: Activity[],
): StoreActivitiesAction => ({
  type: STORE_ACTIVITIES,
  entities: activities,
});
