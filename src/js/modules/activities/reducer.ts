import { mapKeys } from 'lodash';
import { Reducer } from 'redux';

import { CLEAR_STORED_DATA } from '../user';
import { STORE_ACTIVITIES } from './actions';
import { ActivityState, StoreActivitiesAction } from './types';

const initialState: ActivityState = {};

const reducer: Reducer<ActivityState> = (
  state: ActivityState = initialState,
  action: any,
) => {
  switch (action.type) {
    case STORE_ACTIVITIES:
      const activities = (action as StoreActivitiesAction).entities;
      if (activities && activities.length > 0) {
        const newActivitiesObject: ActivityState = mapKeys(
          activities,
          activity => activity.id,
        );

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
