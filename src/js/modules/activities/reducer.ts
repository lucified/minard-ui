import * as moment from 'moment';
import { Reducer } from 'redux';

import { ACTIVITIES, ACTIVITIES_FOR_PROJECT, STORE_ACTIVITIES } from './actions';
import * as t from './types';

const initialState: t.ActivityState = {};

const responseToStateShape = (activities: t.ApiResponse) => {
  const activityType = (activityString: string): t.ActivityType => {
    switch (activityString) {
      case 'deployment':
        return t.ActivityType.Deployment;
      case 'comment':
        return t.ActivityType.Comment;
      default:
        throw new Error('Unknown activity type!');
    }
  };

  const createActivityObject = (activity: t.ResponseActivityElement): t.Activity => {
    return {
      id: activity.id,
      type: activityType(activity.attributes['activity-type']),
      deployment: activity.relationships.deployment.data.id,
      branch: activity.relationships.branch.data.id,
      project: activity.relationships.project.data.id,
      timestamp: moment(activity.attributes.timestamp).valueOf(),
    };
  };

  return activities.reduce((obj, activity) => {
    try {
      const activityObject = createActivityObject(activity);
      return Object.assign(obj, { [activity.id]: activityObject });
    } catch (e) {
      console.log('Error parsing activity:', activity, e);
      return obj;
    }
  }, {});
};

const reducer: Reducer<t.ActivityState> = (state: t.ActivityState = initialState, action: any) => {
  switch (action.type) {
    case ACTIVITIES_FOR_PROJECT.SUCCESS:
    case ACTIVITIES.SUCCESS:
      const activitiesResponse = (<t.RequestActivitiesSuccessAction> action).response;
      if (activitiesResponse && activitiesResponse.length > 0) {
        return Object.assign({}, state, responseToStateShape(activitiesResponse));
      } else {
        return state;
      }
    case STORE_ACTIVITIES:
      const projects = (<t.StoreActivitiesAction> action).entities;
      if (projects && projects.length > 0) {
        return Object.assign({}, state, responseToStateShape(projects));
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default reducer;
