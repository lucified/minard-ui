import { assign } from 'lodash';
import * as moment from 'moment';
import { Reducer } from 'redux';

import { ACTIVITIES, STORE_ACTIVITIES } from './actions';
import * as t from './types';

const initialState: t.ActivityState = {};

const responseToStateShape = (activities: t.ApiResponse) => {
  const activityType = (activityString: string): t.ActivityType => {
    switch (activityString) {
      case 'Deployment':
        return t.ActivityType.Deployment;
      case 'Comment':
        return t.ActivityType.Comment;
      default:
        throw new Error('Unknown activity type!');
    }
  };

  const createActivityObject = (activity: t.ResponseActivityElement): t.Activity => {
    return {
      id: activity.id,
      type: activityType(activity.attributes.activityType),
      deployment: activity.relationships.deployment.data.id,
      branch: activity.relationships.branch.data.id,
      project: activity.relationships.project.data.id,
      timestamp: moment(activity.attributes.timestamp).valueOf(),
    };
  };

  return activities.reduce((obj, activity) =>
    assign(obj, { [activity.id]: createActivityObject(activity) }), {});
};

const reducer: Reducer<t.ActivityState> = (state: t.ActivityState = initialState, action: any) => {
  switch (action.type) {
    case ACTIVITIES.SUCCESS:
      const activitiesResponse = (<t.RequestActivitiesSuccessAction> action).response;
      if (activitiesResponse && activitiesResponse.length > 0) {
        return assign<t.ActivityState, t.ActivityState>({}, state, responseToStateShape(activitiesResponse));
      } else {
        return state;
      }
    case STORE_ACTIVITIES:
      const projects = (<t.StoreActivitiesAction> action).entities;
      if (projects && projects.length > 0) {
        return assign<t.ActivityState, t.ActivityState>({}, state, responseToStateShape(projects));
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default reducer;
