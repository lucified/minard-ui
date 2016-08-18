import { createSelector } from 'reselect';

import { StateTree } from '../../reducers';
import Activities from '../activities';
import Projects from '../projects';

import * as t from './types';

const selectLoadingTree = (state: StateTree) => state.loading;

export const isLoadingAllProjects = createSelector<StateTree, boolean, t.LoadingState>(
  selectLoadingTree,
  (loadingInformations) =>
    !!loadingInformations.find(loadingInfo => loadingInfo.type === Projects.actions.ALL_PROJECTS.REQUEST)
);

export const isLoadingAllActivities = createSelector<StateTree, boolean, t.LoadingState>(
  selectLoadingTree,
  (loadingInformations) =>
    !!loadingInformations.find(loadingInfo => loadingInfo.type === Activities.actions.ACTIVITIES.REQUEST)
);

export const isLoadinglActivitiesForProject = (state: StateTree, id: string) =>
  !!selectLoadingTree(state).find(loadingInfo =>
    (loadingInfo.type === Activities.actions.ACTIVITIES_FOR_PROJECT.REQUEST) &&
    (loadingInfo.id === id)
  );
