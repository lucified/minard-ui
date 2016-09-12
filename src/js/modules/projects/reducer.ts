import { omit } from 'lodash';
import { Reducer } from 'redux';

import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';

import { ADD_BRANCHES_TO_PROJECT, STORE_PROJECTS } from './actions';
import * as t from './types';

const initialState: t.ProjectState = {};

const reducer: Reducer<t.ProjectState> = (state = initialState, action: any) => {
  let project: t.Project | FetchError;
  let id: string;

  switch (action.type) {
    case Requests.actions.Projects.LoadProject.FAILURE.type:
      const responseAction = <FetchError> action;
      id = responseAction.id;
      const existingEntity = state[id];
      if (!existingEntity || isFetchError(existingEntity)) {
        return Object.assign({}, state, { [id]: responseAction });
      }

      console.log('Error: fetching failed! Not replacing existing entity.'); // tslint:disable-line:no-console
      return state;
    case ADD_BRANCHES_TO_PROJECT:
      const { id: projectId, branches } = <t.AddBranchesToProjectAction> action;
      project = state[projectId];

      if (project && !isFetchError(project)) {
        const newProject = Object.assign({}, project, { branches });
        return Object.assign({}, state, { [projectId]: newProject });
      }

      console.log('Error: trying save branches to project that does not exist.'); // tslint:disable-line:no-console
      return state;
    case Requests.actions.Branches.LoadBranchesForProject.FAILURE.type:
      const fetchError = <FetchError> action;
      project = state[fetchError.id];

      // Only store the FetchError if branches does not exist or it's an error
      if (project && !isFetchError(project) && (!project.branches || isFetchError(project.branches))) {
        const newProject = Object.assign({}, project, { branches: fetchError });
        return Object.assign({}, state, { [fetchError.id]: newProject });
      }

      return state;
    case Requests.actions.Projects.DeleteProject.SUCCESS.type:
      id = action.id;
      if (state[id]) {
        return omit<t.ProjectState, t.ProjectState>(state, id);
      }

      console.log('Error: trying to delete a project that does not exist.'); // tslint:disable-line:no-console
      return state;
    case STORE_PROJECTS:
      const projects = (<t.StoreProjectsAction> action).entities;
      if (projects && projects.length > 0) {
        const newProjects = projects.reduce<t.ProjectState>((obj: t.ProjectState, newProject: t.Project) => {
          // If existing project has branches, store those
          const existingProject = state[newProject.id];
          if (existingProject && !isFetchError(existingProject) && existingProject.branches) {
            newProject.branches = existingProject.branches;
          }

          return Object.assign(obj, { [newProject.id]: newProject });
        }, {});

        return Object.assign({}, state, newProjects);
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
