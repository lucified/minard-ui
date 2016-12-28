import { mapKeys } from 'lodash';
import { Reducer } from 'redux';

import { STORE_ACTIVITIES } from './actions';
import * as t from './types';

const initialState: t.ActivityState = {};

const reducer: Reducer<t.ActivityState> = (state: t.ActivityState = initialState, action: any) => {
  switch (action.type) {
    case STORE_ACTIVITIES:
      const activities = (<t.StoreActivitiesAction> action).entities;
      if (activities && activities.length > 0) {
        const newActivitiesObject: t.ActivityState = mapKeys(activities, activity => activity.id);

        return {
          ...state,
          ...newActivitiesObject,
        };
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
