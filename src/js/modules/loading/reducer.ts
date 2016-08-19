import { Reducer } from 'redux';

import Activities from '../activities';
import Projects from '../projects';

import * as t from './types';

const initialState: t.LoadingState = [];

const reducer: Reducer<t.LoadingState> = (state = initialState, action: any) => {
  switch (action.type) {
    case Projects.actions.ALL_PROJECTS.REQUEST:
    case Activities.actions.ACTIVITIES.REQUEST:
      return state.concat({ type: action.type });
    case Activities.actions.ACTIVITIES_FOR_PROJECT.REQUEST:
      return state.concat({ type: action.type, id: action.id });
    case Activities.actions.ACTIVITIES_FOR_PROJECT.FAILURE:
    case Activities.actions.ACTIVITIES_FOR_PROJECT.SUCCESS:
      return state.filter(loadingInfo =>
        (loadingInfo.type !== Activities.actions.ACTIVITIES_FOR_PROJECT.REQUEST) &&
        (loadingInfo.id !== action.id)
      );
    case Projects.actions.ALL_PROJECTS.FAILURE:
    case Projects.actions.ALL_PROJECTS.SUCCESS:
      return state.filter(loadingInfo => loadingInfo.type !== Projects.actions.ALL_PROJECTS.REQUEST);
    case Activities.actions.ACTIVITIES.FAILURE:
    case Activities.actions.ACTIVITIES.SUCCESS:
      return state.filter(loadingInfo => loadingInfo.type !== Activities.actions.ACTIVITIES.REQUEST);
    default:
      return state;
  }
};

export default reducer;
