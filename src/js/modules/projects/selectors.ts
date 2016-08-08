import { values } from 'lodash';
import { createSelector } from 'reselect';

import { StateTree } from '../../reducers';
import { FetchError } from '../errors';
import { Project } from './types';

const selectProjectTree = (state: StateTree) => state.entities.projects;

export const getProjects = createSelector(
  selectProjectTree,
  projects => values<Project | FetchError>(projects)
);

export const getProject = (state: StateTree, id: string) => selectProjectTree(state)[id];
