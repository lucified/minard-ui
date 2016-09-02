import { Reducer } from 'redux';

import Activities from '../activities';
import Projects from '../projects';

import * as t from './types';

const initialState: t.RequestsState = [];

const returnFilteredStateIfChanged = (
  state: t.RequestsState,
  predicate: (error: t.RequestInformation) => boolean
): t.RequestsState => {
  const filteredState = state.filter(predicate);
  return filteredState.length !== state.length ? filteredState : state;
};

const reducer: Reducer<t.RequestsState> = (state = initialState, action: any) => {
  switch (action.type) {
    case Projects.actions.ALL_PROJECTS.REQUEST:
    case Activities.actions.ACTIVITIES.REQUEST:
      return state.concat({ type: action.type });
    case Activities.actions.ACTIVITIES_FOR_PROJECT.REQUEST:
      return state.concat({ type: action.type, id: action.id });
    case Activities.actions.ACTIVITIES_FOR_PROJECT.FAILURE:
    case Activities.actions.ACTIVITIES_FOR_PROJECT.SUCCESS:
      return returnFilteredStateIfChanged(state, requestInfo =>
        (requestInfo.type !== Activities.actions.ACTIVITIES_FOR_PROJECT.REQUEST) ||
        (requestInfo.id !== action.id)
      );
    case Projects.actions.ALL_PROJECTS.FAILURE:
    case Projects.actions.ALL_PROJECTS.SUCCESS:
      return returnFilteredStateIfChanged(state, requestInfo =>
        requestInfo.type !== Projects.actions.ALL_PROJECTS.REQUEST
      );
    case Activities.actions.ACTIVITIES.FAILURE:
    case Activities.actions.ACTIVITIES.SUCCESS:
      return returnFilteredStateIfChanged(state, requestInfo =>
        requestInfo.type !== Activities.actions.ACTIVITIES.REQUEST
      );
    case Projects.actions.SEND_DELETE_PROJECT.REQUEST:
      return state.concat(action);
    case Projects.actions.SEND_DELETE_PROJECT.SUCCESS:
    case Projects.actions.SEND_DELETE_PROJECT.FAILURE:
      return returnFilteredStateIfChanged(state, requestInfo =>
        (requestInfo.type !== Projects.actions.SEND_DELETE_PROJECT.REQUEST) ||
        (requestInfo.id !== action.id)
      );
    default:
      return state;
  }
};

export default reducer;
