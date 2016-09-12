import { createSelector } from 'reselect';

import { StateTree } from '../../reducers';
import Requests from '../requests';

import * as t from './types';

const selectRequestsTree = (state: StateTree) => state.requests;

export const isLoadingAllProjects = createSelector<StateTree, boolean, t.RequestsState>(
  selectRequestsTree,
  (requestInformations) =>
    !!requestInformations.find(requestInfo =>
      requestInfo.type === Requests.actions.Projects.LoadAllProjects.REQUEST.type
    )
);

export const isLoadingAllActivities = createSelector<StateTree, boolean, t.RequestsState>(
  selectRequestsTree,
  (requestInformations) =>
    !!requestInformations.find(requestInfo =>
      requestInfo.type === Requests.actions.Activities.LoadAllActivities.REQUEST.type
    )
);

export const isLoadingActivitiesForProject = (state: StateTree, id: string): boolean =>
  !!selectRequestsTree(state).find(requestInfo =>
    (requestInfo.type === Requests.actions.Activities.LoadActivitiesForProject.REQUEST.type) &&
    (requestInfo.id === id)
  );

export const isDeletingProject = (state: StateTree, id: string): boolean =>
  !!selectRequestsTree(state).find(requestInfo =>
    (requestInfo.type === Requests.actions.Projects.DeleteProject.REQUEST.type) &&
    (requestInfo.id === id)
  );

export const isLoadingCommitsForBranch = (state: StateTree, id: string): boolean =>
  !!selectRequestsTree(state).find(requestInfo =>
    (requestInfo.type === Requests.actions.Commits.LoadCommitsForBranch.REQUEST.type) &&
    (requestInfo.id === id)
  );
