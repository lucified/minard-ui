import { Reducer } from 'redux';

import {
  STORE_PROJECT_NOTIFICATION_CONFIGURATIONS,
  STORE_TEAM_NOTIFICATION_CONFIGURATIONS,
} from './actions';
import { NotificationsState } from './types';

const initialState: NotificationsState = { projects: {} };

const reducer: Reducer<NotificationsState> = (
  state = initialState,
  action: any,
) => {
  switch (action.type) {
    case STORE_PROJECT_NOTIFICATION_CONFIGURATIONS:
      return {
        ...state,
        projects: {
          ...state.projects,
          [action.id]: action.configurations,
        },
      };
    case STORE_TEAM_NOTIFICATION_CONFIGURATIONS:
      return {
        ...state,
        team: action.configurations,
      };
    default:
      return state;
  }
};

export default reducer;
