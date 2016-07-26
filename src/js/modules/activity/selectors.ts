import * as _ from 'lodash';

import { StateTree } from '../../reducers';
import * as t from './types';

const selectActivityTree = (state: StateTree) => state.entities.activities;

export const getActivityForProject = (state: StateTree, projectId: string) =>
  _.values<t.Activity>(selectActivityTree(state))
  .filter(activity => activity.project === projectId)
  .sort((a, b) => b.timestamp - a.timestamp);
