import * as _ from 'lodash';

import { StateTree } from '../../reducers';

const selectProjectTree = (state: StateTree) => state.entities.projects;

export const getProjects = (state: StateTree) => _.values(selectProjectTree(state));
export const getIDs = (state: StateTree) => Object.keys(selectProjectTree(state));
export const getProject = (state: StateTree, id: string) => selectProjectTree(state)[id];
export const getBranches = (state: StateTree, id: string) => selectProjectTree(state)[id].branches;
