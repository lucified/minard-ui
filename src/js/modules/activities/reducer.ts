import * as moment from 'moment';
import { Reducer } from 'redux';

import { RequestFetchSuccessAction } from '../types';

import { ACTIVITIES, ACTIVITIES_FOR_PROJECT, STORE_ACTIVITIES } from './actions';
import * as t from './types';

const initialState: t.ActivityState = {};

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
  const commit = activity.attributes.commit;
  const deployment = activity.attributes.deployment;

  return {
    id: activity.id,
    type: activityType(activity.attributes['activity-type']),
    project: activity.attributes.project,
    branch: activity.attributes.branch,
    commit: {
      id: commit.id,
      hash: commit.hash,
      message: commit.message,
      author: {
        name: commit.author.name,
        email: commit.author.email,
        timestamp: moment(commit.author.timestamp).valueOf(),
      },
      committer: {
        name: commit.committer.name,
        email: commit.committer.email,
        timestamp: moment(commit.committer.timestamp).valueOf(),
      },
    },
    deployment: {
      status: deployment.status,
      id: deployment.id,
      url: deployment.url,
      screenshot: deployment.screenshot,
      creator: {
        name: deployment.creator.name,
        email: deployment.creator.email,
        timestamp: moment(deployment.creator.timestamp).valueOf(),
      },
    },
    timestamp: moment(activity.attributes.timestamp).valueOf(),
  };
};

const responseToStateShape = (activities: t.ApiResponse): t.ActivityState =>
  activities.reduce<t.ActivityState>((obj, activity) => {
    try {
      const activityObject = createActivityObject(activity);
      return Object.assign(obj, { [activity.id]: activityObject });
    } catch (e) {
      console.log('Error parsing activity:', activity, e); // tslint:disable-line:no-console
      return obj;
    }
  }, {});

const reducer: Reducer<t.ActivityState> = (state: t.ActivityState = initialState, action: any) => {
  switch (action.type) {
    case ACTIVITIES_FOR_PROJECT.SUCCESS:
    case ACTIVITIES.SUCCESS:
      const activitiesResponse = (<RequestFetchSuccessAction<t.ResponseActivityElement[]>> action).response;
      if (activitiesResponse && activitiesResponse.length > 0) {
        return Object.assign({}, state, responseToStateShape(activitiesResponse));
      }

      return state;
    case STORE_ACTIVITIES:
      const projects = (<t.StoreActivitiesAction> action).entities;
      if (projects && projects.length > 0) {
        return Object.assign({}, state, responseToStateShape(projects));
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
