import { createSelector } from 'reselect';

import { StateTree } from '../../reducers';

import * as actions from './actions';
import * as t from './types';

const selectRequestsTree = (state: StateTree) => state.requests;

export const isLoadingAllProjects = createSelector<StateTree, boolean, t.RequestsState>(
  selectRequestsTree,
  (requestInformations) =>
    !!requestInformations.find(requestInfo =>
      requestInfo.type === actions.Projects.LoadAllProjects.REQUEST.type
    )
);

export const isLoadingAllActivities = createSelector<StateTree, boolean, t.RequestsState>(
  selectRequestsTree,
  (requestInformations) =>
    !!requestInformations.find(requestInfo =>
      requestInfo.type === actions.Activities.LoadAllActivities.REQUEST.type
    )
);

export const isLoadingActivitiesForProject = (state: StateTree, id: string): boolean =>
  !!selectRequestsTree(state).find(requestInfo =>
    (requestInfo.type === actions.Activities.LoadActivitiesForProject.REQUEST.type) &&
    (requestInfo.id === id)
  );

export const isDeletingProject = (state: StateTree, id: string): boolean =>
  !!selectRequestsTree(state).find(requestInfo =>
    (requestInfo.type === actions.Projects.DeleteProject.REQUEST.type) &&
    (requestInfo.id === id)
  );

export const isLoadingCommitsForBranch = (state: StateTree, id: string): boolean =>
  !!selectRequestsTree(state).find(requestInfo =>
    (requestInfo.type === actions.Commits.LoadCommitsForBranch.REQUEST.type) &&
    (requestInfo.id === id)
  );
