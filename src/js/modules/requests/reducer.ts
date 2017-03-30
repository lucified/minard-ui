import { Reducer } from 'redux';

import { DeleteError, FetchError } from '../errors';
import { CLEAR_STORED_DATA } from '../user';
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
    case actions.Comments.DeleteComment.REQUEST.type:
    case actions.User.LoadTeamInformation.REQUEST.type:
    case actions.ALL_ACTIVITIES_REQUESTED:
    case actions.ALL_ACTIVITIES_REQUESTED_FOR_PROJECT:
      return state.concat(action);

    case actions.Activities.LoadActivitiesForProject.FAILURE.type:
    case actions.Activities.LoadActivitiesForProject.SUCCESS.type:
      const loadActivitiesAction = action as t.EntitySuccessAction | FetchError;
      return returnFilteredStateIfChanged(
        state,
        requestInfo => (requestInfo.type !== actions.Activities.LoadActivitiesForProject.REQUEST.type) ||
          (requestInfo.id !== loadActivitiesAction.id),
      );
    case actions.Activities.LoadAllActivities.FAILURE.type:
    case actions.Activities.LoadAllActivities.SUCCESS.type:
      return returnFilteredStateIfChanged(
        state,
        requestInfo => requestInfo.type !== actions.Activities.LoadAllActivities.REQUEST.type,
      );
    case actions.User.LoadTeamInformation.FAILURE.type:
    case actions.User.LoadTeamInformation.SUCCESS.type:
      return returnFilteredStateIfChanged(
        state,
        requestInfo => requestInfo.type !== actions.User.LoadTeamInformation.REQUEST.type,
      );
    case actions.Comments.LoadCommentsForDeployment.FAILURE.type:
    case actions.Comments.LoadCommentsForDeployment.SUCCESS.type:
      const loadCommentsAction = action as t.EntitySuccessAction | FetchError;
      return returnFilteredStateIfChanged(
        state,
        requestInfo => (requestInfo.type !== actions.Comments.LoadCommentsForDeployment.REQUEST.type) ||
          (requestInfo.id !== loadCommentsAction.id),
      );
    case actions.Comments.DeleteComment.FAILURE.type:
    case actions.Comments.DeleteComment.SUCCESS.type:
      const deleteCommentAction = action as t.EntitySuccessAction | DeleteError;
      return returnFilteredStateIfChanged(
        state,
        requestInfo => (requestInfo.type !== actions.Comments.DeleteComment.REQUEST.type) ||
          (requestInfo.id !== deleteCommentAction.id),
      );
    case actions.Commits.LoadCommitsForBranch.FAILURE.type:
    case actions.Commits.LoadCommitsForBranch.SUCCESS.type:
      const loadCommitsForBranchAction = action as t.EntitySuccessAction | FetchError;
      return returnFilteredStateIfChanged(
        state,
        requestInfo => (requestInfo.type !== actions.Commits.LoadCommitsForBranch.REQUEST.type) ||
          (requestInfo.id !== loadCommitsForBranchAction.id),
      );
    case actions.Projects.LoadAllProjects.FAILURE.type:
    case actions.Projects.LoadAllProjects.SUCCESS.type:
      return returnFilteredStateIfChanged(
        state,
        requestInfo => requestInfo.type !== actions.Projects.LoadAllProjects.REQUEST.type,
      );
    case actions.Projects.DeleteProject.SUCCESS.type:
    case actions.Projects.DeleteProject.FAILURE.type:
      const deleteProjectAction = action as t.EntitySuccessAction | DeleteError;
      return returnFilteredStateIfChanged(
        state,
        requestInfo => (requestInfo.type !== actions.Projects.DeleteProject.REQUEST.type) ||
          (requestInfo.id !== deleteProjectAction.id),
      );
    case CLEAR_STORED_DATA:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
