import { Reducer } from 'redux';

import * as actions from './actions';
import * as t from './types';

const initialState: t.RequestsState = [];

const returnFilteredStateIfChanged = (
  state: t.RequestsState,
  predicate: (error: t.RequestInformation) => boolean,
): t.RequestsState => {
  const filteredState = state.filter(predicate);
  return filteredState.length !== state.length ? filteredState : state;
};

const reducer: Reducer<t.RequestsState> = (state = initialState, action: any) => {
  switch (action.type) {
    case actions.Projects.LoadAllProjects.REQUEST.type:
    case actions.Projects.DeleteProject.REQUEST.type:
    case actions.Activities.LoadAllActivities.REQUEST.type:
    case actions.Activities.LoadActivitiesForProject.REQUEST.type:
    case actions.Commits.LoadCommitsForBranch.REQUEST.type:
    case actions.Comments.LoadCommentsForDeployment.REQUEST.type:
    case actions.ALL_ACTIVITIES_REQUESTED:
    case actions.ALL_ACTIVITIES_REQUESTED_FOR_PROJECT:
      return state.concat(action);

    case actions.Activities.LoadActivitiesForProject.FAILURE.type:
    case actions.Activities.LoadActivitiesForProject.SUCCESS.type:
      return returnFilteredStateIfChanged(
        state,
        requestInfo => (requestInfo.type !== actions.Activities.LoadActivitiesForProject.REQUEST.type) ||
          (requestInfo.id !== action.id),
      );
    case actions.Activities.LoadAllActivities.FAILURE.type:
    case actions.Activities.LoadAllActivities.SUCCESS.type:
      return returnFilteredStateIfChanged(
        state,
        requestInfo => requestInfo.type !== actions.Activities.LoadAllActivities.REQUEST.type,
      );
    case actions.Comments.LoadCommentsForDeployment.FAILURE.type:
    case actions.Comments.LoadCommentsForDeployment.SUCCESS.type:
      return returnFilteredStateIfChanged(
        state,
        requestInfo => (requestInfo.type !== actions.Comments.LoadCommentsForDeployment.REQUEST.type) ||
          (requestInfo.id !== action.id),
      );
    case actions.Commits.LoadCommitsForBranch.FAILURE.type:
    case actions.Commits.LoadCommitsForBranch.SUCCESS.type:
      return returnFilteredStateIfChanged(
        state,
        requestInfo => (requestInfo.type !== actions.Commits.LoadCommitsForBranch.REQUEST.type) ||
          (requestInfo.id !== action.id),
      );
    case actions.Projects.LoadAllProjects.FAILURE.type:
    case actions.Projects.LoadAllProjects.SUCCESS.type:
      return returnFilteredStateIfChanged(
        state,
        requestInfo => requestInfo.type !== actions.Projects.LoadAllProjects.REQUEST.type,
      );
    case actions.Projects.DeleteProject.SUCCESS.type:
    case actions.Projects.DeleteProject.FAILURE.type:
      return returnFilteredStateIfChanged(
        state,
        requestInfo => (requestInfo.type !== actions.Projects.DeleteProject.REQUEST.type) ||
          (requestInfo.id !== action.id),
      );
    default:
      return state;
  }
};

export default reducer;
