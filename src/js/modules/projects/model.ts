import * as _ from 'lodash';

import * as t from './types';

export const getProjects = (projects: t.ProjectState) => _.values(projects);
export const getIDs = (projects: t.ProjectState) => Object.keys(projects);
export const getProject = (projects: t.ProjectState, id: string) => projects[id];
export const getBranches = (projects: t.ProjectState, id: string) => projects[id].branches;
