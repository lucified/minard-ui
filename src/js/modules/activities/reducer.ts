import { mapKeys } from 'lodash';
import { Reducer } from 'redux';

import { CLEAR_STORED_DATA } from '../user';
import { STORE_ACTIVITIES } from './actions';
import * as t from './types';

const initialState: t.ActivityState = {};

const reducer: Reducer<t.ActivityState> = (state: t.ActivityState = initialState, action: any) => {
  switch (action.type) {
    case STORE_ACTIVITIES:
      const activities = (action as t.StoreActivitiesAction).entities;
      if (activities && activities.length > 0) {
        const newActivitiesObject: t.ActivityState = mapKeys(activities, activity => activity.id);

        return {
          ...state,
          ...newActivitiesObject,
        };
      }

      return state;
    case CLEAR_STORED_DATA:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
