import * as _ from 'lodash';

import { StateTree } from '../../reducers';
import * as t from './types';

const selectActivityTree = (state: StateTree) => state.entities.activities;
const getUnsortedActivities = (state: StateTree) => _.values<t.Activity>(selectActivityTree(state));

export const getActivityForProject = (state: StateTree, projectId: string) =>
  getUnsortedActivities(state)
    .filter(activity => activity.project === projectId)
    .sort((a, b) => b.timestamp - a.timestamp);

export const getActivities = (state: StateTree) =>
  getUnsortedActivities(state)
    .sort((a, b) => b.timestamp - a.timestamp);
