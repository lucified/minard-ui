import { values } from 'lodash';
import { createSelector } from 'reselect';

import { StateTree } from '../../reducers';
import { Project } from './types';

const selectProjectTree = (state: StateTree) => state.entities.projects;

export const getProjects = createSelector(
  selectProjectTree,
  projects => values<Project>(projects)
);

export const getProject = (state: StateTree, id: string) => selectProjectTree(state)[id];
