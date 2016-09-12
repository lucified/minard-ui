import { Reducer } from 'redux';

import Requests from '../requests';

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
    case Requests.actions.Projects.LoadAllProjects.REQUEST.type:
    case Requests.actions.Activities.LoadAllActivities.REQUEST.type:
    case Requests.actions.Projects.DeleteProject.REQUEST.type:
    case Requests.actions.Activities.LoadActivitiesForProject.REQUEST.type:
    case Requests.actions.Commits.LoadCommitsForBranch.REQUEST.type:
      return state.concat(action);

    case Requests.actions.Activities.LoadActivitiesForProject.FAILURE.type:
    case Requests.actions.Activities.LoadActivitiesForProject.SUCCESS.type:
      return returnFilteredStateIfChanged(state, requestInfo =>
        (requestInfo.type !== Requests.actions.Activities.LoadActivitiesForProject.REQUEST.type) ||
        (requestInfo.id !== action.id)
      );
    case Requests.actions.Commits.LoadCommitsForBranch.FAILURE.type:
    case Requests.actions.Commits.LoadCommitsForBranch.SUCCESS.type:
      return returnFilteredStateIfChanged(state, requestInfo =>
        (requestInfo.type !== Requests.actions.Commits.LoadCommitsForBranch.REQUEST.type) ||
        (requestInfo.id !== action.id)
      );
    case Requests.actions.Projects.LoadAllProjects.FAILURE.type:
    case Requests.actions.Projects.LoadAllProjects.SUCCESS.type:
      return returnFilteredStateIfChanged(state, requestInfo =>
        requestInfo.type !== Requests.actions.Projects.LoadAllProjects.REQUEST.type
      );
    case Requests.actions.Activities.LoadAllActivities.FAILURE.type:
    case Requests.actions.Activities.LoadAllActivities.SUCCESS.type:
      return returnFilteredStateIfChanged(state, requestInfo =>
        requestInfo.type !== Requests.actions.Activities.LoadAllActivities.REQUEST.type
      );
    case Requests.actions.Projects.DeleteProject.SUCCESS.type:
    case Requests.actions.Projects.DeleteProject.FAILURE.type:
      return returnFilteredStateIfChanged(state, requestInfo =>
        (requestInfo.type !== Requests.actions.Projects.DeleteProject.REQUEST.type) ||
        (requestInfo.id !== action.id)
      );

    default:
      return state;
  }
};

export default reducer;
