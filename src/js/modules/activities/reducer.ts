import { Reducer } from 'redux';

import { STORE_ACTIVITIES } from './actions';
import * as t from './types';

const initialState: t.ActivityState = {};

const reducer: Reducer<t.ActivityState> = (state: t.ActivityState = initialState, action: any) => {
  switch (action.type) {
    case STORE_ACTIVITIES:
      const activities = (<t.StoreActivitiesAction> action).entities;
      if (activities && activities.length > 0) {
        const newActivitiesObject: t.ActivityState =
          activities.reduce<t.ActivityState>((obj: t.ActivityState, newActivity: t.Activity) =>
            Object.assign(obj, { [newActivity.id]: newActivity }),
          {});

        return Object.assign({}, state, newActivitiesObject);
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
