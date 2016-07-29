import { ActionCreator } from 'redux';

import { createRequestTypes } from '../common';
import * as t from './types';

export const PROJECTS = createRequestTypes('PROJECTS');

export const requestActionCreators: t.ProjectsRequestActionObject = {
  request: () => ({ type: PROJECTS.REQUEST }),
  success: (response) => ({ type: PROJECTS.SUCCESS, response }),
  failure: (error) => ({ type: PROJECTS.FAILURE, error }),
};

export const LOAD_ALL_PROJECTS = 'PROJECTS/LOAD_ALL_PROJECTS';
export const loadProjects: ActionCreator<t.LoadProjectsAction> = () => ({
  type: LOAD_ALL_PROJECTS,
});
