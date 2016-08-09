import { values } from 'lodash';
import { createSelector } from 'reselect';

import { StateTree } from '../../reducers';
import { Activity } from './types';

const selectActivityTree = (state: StateTree) => state.entities.activities;

const getUnsortedActivities = createSelector(
  selectActivityTree,
  activities => values<Activity>(activities)
);

export const getActivities = createSelector(
  getUnsortedActivities,
  activities => activities.sort((a, b) => b.timestamp - a.timestamp)
);
