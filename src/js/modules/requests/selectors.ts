import { createSelector } from 'reselect';

import { StateTree } from '../../reducers';
import Activities from '../activities';
import Projects from '../projects';

import * as t from './types';

const selectRequestsTree = (state: StateTree) => state.requests;

export const isLoadingAllProjects = createSelector<StateTree, boolean, t.RequestsState>(
  selectRequestsTree,
  (requestInformations) =>
    !!requestInformations.find(requestInfo => requestInfo.type === Projects.actions.ALL_PROJECTS.REQUEST)
);

export const isLoadingAllActivities = createSelector<StateTree, boolean, t.RequestsState>(
  selectRequestsTree,
  (requestInformations) =>
    !!requestInformations.find(requestInfo => requestInfo.type === Activities.actions.ACTIVITIES.REQUEST)
);

export const isLoadinglActivitiesForProject = (state: StateTree, id: string): boolean =>
  !!selectRequestsTree(state).find(requestInfo =>
    (requestInfo.type === Activities.actions.ACTIVITIES_FOR_PROJECT.REQUEST) &&
    (requestInfo.id === id)
  );

export const isDeletingProject = (state: StateTree, id: string): boolean =>
  !!selectRequestsTree(state).find(requestInfo =>
    (requestInfo.type === Projects.actions.SEND_DELETE_PROJECT.REQUEST) &&
    (requestInfo.id === id)
  );
