import { createRequestTypes, prettyErrorMessage } from '../common';
import * as t from './types';

// Load multiple projects
export const LOAD_ALL_PROJECTS = 'PROJECTS/LOAD_ALL_PROJECTS';
export const loadAllProjects = (): t.LoadAllProjectsAction => ({
  type: LOAD_ALL_PROJECTS,
});

export const ALL_PROJECTS = createRequestTypes('PROJECTS/ALL_PROJECTS');
export const FetchAllProjects: t.RequestAllProjectsActionCreators = {
  request: () => ({ type: ALL_PROJECTS.REQUEST }),
  success: (response) => ({ type: ALL_PROJECTS.SUCCESS, response }),
  failure: (error, details) => ({
    type: ALL_PROJECTS.FAILURE,
    id: null,
    error,
    details,
    prettyError: prettyErrorMessage(error),
  }),
};

// Load a single project
export const LOAD_PROJECT = 'PROJECTS/LOAD_PROJECT';
export const loadProject = (id: string): t.LoadProjectAction => ({
  type: LOAD_PROJECT,
  id,
});

export const PROJECT = createRequestTypes('PROJECTS/PROJECT');
export const FetchProject: t.RequestProjectActionCreators = {
  request: (id) => ({ type: PROJECT.REQUEST, id }),
  success: (id, response) => ({ type: PROJECT.SUCCESS, id, response }),
  failure: (id, error, details) => ({
    type: PROJECT.FAILURE,
    id,
    error,
    details,
    prettyError: prettyErrorMessage(error),
  }),
};

// Store included projects
export const STORE_PROJECTS = 'PROJECTS/STORE_PROJECTS';
export const storeProjects = (projects: t.ResponseProjectElement[]): t.StoreProjectsAction => ({
  type: STORE_PROJECTS,
  entities: projects,
});

// Create a new project
export const CREATE_PROJECT = 'PROJECTS/CREATE_PROJECT';

export const SEND_CREATE_PROJECT = createRequestTypes('PROJECTS/SEND_CREATE_PROJECT');
export const SendCreateProject: t.SendCreateProjectActionCreators = {
  request: (name, description) => ({ type: SEND_CREATE_PROJECT.REQUEST, name, description }),
  success: (id) => ({ type: SEND_CREATE_PROJECT.SUCCESS, id }),
  failure: (error, details) => ({
    type: SEND_CREATE_PROJECT.FAILURE,
    error,
    details,
    prettyError: prettyErrorMessage(error),
  }),
};

// Edit an existing project
export const DELETE_PROJECT = 'PROJECTS/DELETE_PROJECT';

export const deleteProjectPromiseResolver = (
  id: string,
  resolve: () => void,
  reject: () => void
) => ({
  type: DELETE_PROJECT,
  id,
  resolve,
  reject,
});

export const SEND_DELETE_PROJECT = createRequestTypes('PROJECTS/SEND_DELETE_PROJECT');
export const SendDeleteProject: t.SendDeleteProjectActionCreators = {
  request: (id) => ({ type: SEND_DELETE_PROJECT.REQUEST, id }),
  success: (id) => ({ type: SEND_DELETE_PROJECT.SUCCESS, id }),
  failure: (id, error, details) => ({
    type: SEND_DELETE_PROJECT.FAILURE,
    id,
    error,
    details,
    prettyError: prettyErrorMessage(error),
  }),
};

// Edit an existing project
export const EDIT_PROJECT = 'PROJECTS/EDIT_PROJECT';

export const SEND_EDIT_PROJECT = createRequestTypes('PROJECTS/SEND_EDIT_PROJECT');
export const SendEditProject: t.SendEditProjectActionCreators = {
  request: (id, newAttributes) => ({ type: SEND_EDIT_PROJECT.REQUEST, id, newAttributes }),
  success: (id) => ({ type: SEND_EDIT_PROJECT.SUCCESS, id }),
  failure: (id, error, details) => ({
    type: SEND_EDIT_PROJECT.FAILURE,
    id,
    error,
    details,
    prettyError: prettyErrorMessage(error),
  }),
};
