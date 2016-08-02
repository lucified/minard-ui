import { values } from 'lodash';
import { createSelector } from 'reselect';

import { StateTree } from '../../reducers';
import { Activity } from './types';

const selectActivityTree = (state: StateTree) => state.entities.activities;

const getUnsortedActivities = createSelector(
  selectActivityTree,
  activities => values<Activity>(activities)
);

export const getActivityForProject = (state: StateTree, projectId: string) =>
  getUnsortedActivities(state)
    .filter(activity => activity.project === projectId)
    .sort((a, b) => b.timestamp - a.timestamp);

export const getActivities = (state: StateTree) =>
  getUnsortedActivities(state)
    .sort((a, b) => b.timestamp - a.timestamp);
