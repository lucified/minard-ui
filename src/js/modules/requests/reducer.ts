import { Reducer } from 'redux';

import { DeleteError, FetchError } from '../errors';
import { CLEAR_STORED_DATA } from '../user';
import {
  Activities,
  ALL_ACTIVITIES_REQUESTED,
  ALL_ACTIVITIES_REQUESTED_FOR_PROJECT,
  Comments,
  Commits,
  Projects,
  Team,
} from './actions';
import {
  EntitySuccessAction,
  RequestInformation,
  RequestsState,
} from './types';

const initialState: RequestsState = [];

const returnFilteredStateIfChanged = (
  state: RequestsState,
  predicate: (error: RequestInformation) => boolean,
): RequestsState => {
  const filteredState = state.filter(predicate);
  return filteredState.length !== state.length ? filteredState : state;
};

const reducer: Reducer<RequestsState> = (state = initialState, action: any) => {
  switch (action.type) {
    case Projects.LoadAllProjects.REQUEST.type:
    case Projects.DeleteProject.REQUEST.type:
    case Activities.LoadAllActivities.REQUEST.type:
    case Activities.LoadActivitiesForProject.REQUEST.type:
    case Commits.LoadCommitsForBranch.REQUEST.type:
    case Comments.LoadCommentsForDeployment.REQUEST.type:
    case Comments.DeleteComment.REQUEST.type:
    case Team.LoadTeamInformation.REQUEST.type:
    case Team.LoadNotificationConfigurations.REQUEST.type:
    case ALL_ACTIVITIES_REQUESTED: // Note: How are these two cleared?
    case ALL_ACTIVITIES_REQUESTED_FOR_PROJECT:
      return state.concat(action);

    case Activities.LoadActivitiesForProject.FAILURE.type:
    case Activities.LoadActivitiesForProject.SUCCESS.type:
      const loadActivitiesAction = action as EntitySuccessAction | FetchError;
      return returnFilteredStateIfChanged(
        state,
        requestInfo =>
          requestInfo.type !==
            Activities.LoadActivitiesForProject.REQUEST.type ||
          requestInfo.id !== loadActivitiesAction.id,
      );
    case Activities.LoadAllActivities.FAILURE.type:
    case Activities.LoadAllActivities.SUCCESS.type:
      return returnFilteredStateIfChanged(
        state,
        requestInfo =>
          requestInfo.type !== Activities.LoadAllActivities.REQUEST.type,
      );
    case Team.LoadTeamInformation.FAILURE.type:
    case Team.LoadTeamInformation.SUCCESS.type:
      return returnFilteredStateIfChanged(
        state,
        requestInfo =>
          requestInfo.type !== Team.LoadTeamInformation.REQUEST.type,
      );
    case Team.LoadNotificationConfigurations.FAILURE.type:
    case Team.LoadNotificationConfigurations.SUCCESS.type:
      return returnFilteredStateIfChanged(
        state,
        requestInfo =>
          requestInfo.type !== Team.LoadNotificationConfigurations.REQUEST.type,
      );
    case Comments.LoadCommentsForDeployment.FAILURE.type:
    case Comments.LoadCommentsForDeployment.SUCCESS.type:
      const loadCommentsAction = action as EntitySuccessAction | FetchError;
      return returnFilteredStateIfChanged(
        state,
        requestInfo =>
          requestInfo.type !==
            Comments.LoadCommentsForDeployment.REQUEST.type ||
          requestInfo.id !== loadCommentsAction.id,
      );
    case Comments.DeleteComment.FAILURE.type:
    case Comments.DeleteComment.SUCCESS.type:
      const deleteCommentAction = action as EntitySuccessAction | DeleteError;
      return returnFilteredStateIfChanged(
        state,
        requestInfo =>
          requestInfo.type !== Comments.DeleteComment.REQUEST.type ||
          requestInfo.id !== deleteCommentAction.id,
      );
    case Commits.LoadCommitsForBranch.FAILURE.type:
    case Commits.LoadCommitsForBranch.SUCCESS.type:
      const loadCommitsForBranchAction = action as
        | EntitySuccessAction
        | FetchError;
      return returnFilteredStateIfChanged(
        state,
        requestInfo =>
          requestInfo.type !== Commits.LoadCommitsForBranch.REQUEST.type ||
          requestInfo.id !== loadCommitsForBranchAction.id,
      );
    case Projects.LoadAllProjects.FAILURE.type:
    case Projects.LoadAllProjects.SUCCESS.type:
      return returnFilteredStateIfChanged(
        state,
        requestInfo =>
          requestInfo.type !== Projects.LoadAllProjects.REQUEST.type,
      );
    case Projects.DeleteProject.SUCCESS.type:
    case Projects.DeleteProject.FAILURE.type:
      const deleteProjectAction = action as EntitySuccessAction | DeleteError;
      return returnFilteredStateIfChanged(
        state,
        requestInfo =>
          requestInfo.type !== Projects.DeleteProject.REQUEST.type ||
          requestInfo.id !== deleteProjectAction.id,
      );
    case CLEAR_STORED_DATA:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
