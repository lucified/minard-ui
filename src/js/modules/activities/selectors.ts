import { values } from 'lodash';
import { createSelector } from 'reselect';

import { StateTree } from '../../reducers';
import Selected from '../selected';
import { Activity } from './types';

const selectActivityTree = (state: StateTree) => state.entities.activities;

export const getActivities = createSelector(selectActivityTree, activities =>
  values<Activity>(activities).sort((a, b) => b.timestamp - a.timestamp),
);

export const getActivitiesForProject = createSelector(
  getActivities,
  Selected.selectors.getSelectedProject,
  (activities, project) =>
    activities.filter(activity => activity.project.id === project),
);
