import { createSelector } from 'reselect';

import { StateTree } from '../../reducers';

import * as actions from './actions';
import { RequestsState } from './types';

const selectRequestsTree = (state: StateTree) => state.requests;

export const isLoadingTeamInformation = createSelector<
  StateTree,
  RequestsState,
  boolean
>(
  selectRequestsTree,
  requestInformations =>
    !!requestInformations.find(
      requestInfo =>
        requestInfo.type === actions.User.LoadTeamInformation.REQUEST.type,
    ),
);

export const isLoggingIn = isLoadingTeamInformation;

export const isLoadingAllProjects = createSelector<
  StateTree,
  RequestsState,
  boolean
>(
  selectRequestsTree,
  requestInformations =>
    !!requestInformations.find(
      requestInfo =>
        requestInfo.type === actions.Projects.LoadAllProjects.REQUEST.type,
    ),
);

export const isLoadingAllActivities = createSelector<
  StateTree,
  RequestsState,
  boolean
>(
  selectRequestsTree,
  requestInformations =>
    !!requestInformations.find(
      requestInfo =>
        requestInfo.type === actions.Activities.LoadAllActivities.REQUEST.type,
    ),
);

export const isLoadingActivitiesForProject = (
  state: StateTree,
  id: string,
): boolean =>
  !!selectRequestsTree(state).find(
    requestInfo =>
      requestInfo.type ===
        actions.Activities.LoadActivitiesForProject.REQUEST.type &&
      requestInfo.id === id,
  );

export const isDeletingProject = (state: StateTree, id: string): boolean =>
  !!selectRequestsTree(state).find(
    requestInfo =>
      requestInfo.type === actions.Projects.DeleteProject.REQUEST.type &&
      requestInfo.id === id,
  );

export const isLoadingCommentsForDeployment = (
  state: StateTree,
  id: string,
): boolean =>
  !!selectRequestsTree(state).find(
    requestInfo =>
      requestInfo.type ===
        actions.Comments.LoadCommentsForDeployment.REQUEST.type &&
      requestInfo.id === id,
  );

export const isDeletingComment = (state: StateTree, id: string): boolean =>
  !!selectRequestsTree(state).find(
    requestInfo =>
      requestInfo.type === actions.Comments.DeleteComment.REQUEST.type &&
      requestInfo.id === id,
  );

export const isSettingVisibilityForProject = (
  state: StateTree,
  id: string,
): boolean =>
  !!selectRequestsTree(state).find(
    requestInfo =>
      requestInfo.type === actions.Projects.SetProjectVisibility.REQUEST.type &&
      requestInfo.id === id,
  );

export const isLoadingCommitsForBranch = (
  state: StateTree,
  id: string,
): boolean =>
  !!selectRequestsTree(state).find(
    requestInfo =>
      requestInfo.type === actions.Commits.LoadCommitsForBranch.REQUEST.type &&
      requestInfo.id === id,
  );

export const isAllActivitiesRequested = createSelector<
  StateTree,
  RequestsState,
  boolean
>(
  selectRequestsTree,
  requestInformations =>
    !!requestInformations.find(
      requestInfo => requestInfo.type === actions.ALL_ACTIVITIES_REQUESTED,
    ),
);

export const isAllActivitiesRequestedForProject = (
  state: StateTree,
  id: string,
): boolean =>
  !!selectRequestsTree(state).find(
    requestInfo =>
      requestInfo.type === actions.ALL_ACTIVITIES_REQUESTED_FOR_PROJECT &&
      requestInfo.id === id,
  );
