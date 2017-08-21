import mapValues = require('lodash/mapValues');
import { Reducer } from 'redux';

import Requests from '../requests';

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
    case Requests.actions.Notifications.Delete.SUCCESS.type:
      return {
        team: state.team && state.team.filter(d => d.id !== action.id),
        projects: mapValues(
          state.projects,
          p => p && p.filter(d => d.id !== action.id),
        ),
      };
    default:
      return state;
  }
};

export default reducer;
