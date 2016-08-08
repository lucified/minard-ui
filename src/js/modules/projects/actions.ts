import { ActionCreator } from 'redux';

import { createRequestTypes } from '../common';
import * as t from './types';

// Load multiple projects
export const LOAD_ALL_PROJECTS = 'PROJECTS/LOAD_ALL_PROJECTS';
export const loadAllProjects: ActionCreator<t.RequestAllProjectsAction> = () => ({
  type: LOAD_ALL_PROJECTS,
});

export const ALL_PROJECTS = createRequestTypes('PROJECTS/ALL_PROJECTS');
export const FetchAllProjects: t.RequestAllProjectsActionCreators = {
  request: () => ({ type: ALL_PROJECTS.REQUEST }),
  success: (response) => ({ type: ALL_PROJECTS.SUCCESS, response }),
  failure: (error) => ({ type: ALL_PROJECTS.FAILURE, error }),
};

// Load a single project
export const LOAD_PROJECT = 'PROJECTS/LOAD_PROJECT';
export const loadProject: ActionCreator<t.RequestProjectAction> = (id) => ({
  type: LOAD_PROJECT,
  id,
});

export const PROJECT = createRequestTypes('PROJECTS/PROJECT');
export const FetchProject: t.RequestProjectActionCreators = {
  request: (id) => ({ type: PROJECT.REQUEST, id }),
  success: (id, response) => ({ type: PROJECT.SUCCESS, id, response }),
  failure: (id, error) => ({ type: PROJECT.FAILURE, id, error }),
};

// Store included projects
export const STORE_PROJECTS = 'PROJECTS/STORE_PROJECTS';
export const StoreProjects: ActionCreator<t.StoreProjectsAction> = (projects) => ({
  type: STORE_PROJECTS,
  entities: projects,
});
