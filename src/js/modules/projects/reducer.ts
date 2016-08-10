import * as assign from 'lodash/assign';
import { Reducer } from 'redux';

import { FetchError, isError } from '../errors';

import { ALL_PROJECTS, PROJECT, STORE_PROJECTS } from './actions';
import * as t from './types';

const initialState: t.ProjectState = {};

const responseToStateShape = (projects: t.ApiResponse) => {
  const createProjectObject = (project: t.ResponseProjectElement): t.Project => {
    const branches =  project.relationships.branches &&
       project.relationships.branches.data &&
       project.relationships.branches.data.map(({ id }) => id);

    return {
      id: project.id,
      name: project.attributes.name,
      description: project.attributes.description,
      branches,
      activeUsers: project.attributes.activeCommiters,
    };
  };

  return projects.reduce((obj, project) =>
    assign(obj, { [project.id]: createProjectObject(project) }), {});
};

const reducer: Reducer<t.ProjectState> = (state = initialState, action: any) => {
  switch (action.type) {
    case ALL_PROJECTS.SUCCESS:
      const projectsResponse = (<t.RequestAllProjectsSuccessAction> action).response;
      if (projectsResponse && projectsResponse.length > 0) {
        return assign({}, state, responseToStateShape(projectsResponse));
      } else {
        return state;
      }
    case PROJECT.SUCCESS:
      const projectResponse = (<t.RequestProjectSuccessAction> action).response;
      if (projectResponse) {
        return assign({}, state, responseToStateShape([projectResponse]));
      } else {
        return state;
      }
    case PROJECT.FAILURE:
      const responseAction = <FetchError> action;
      const id = responseAction.id!;
      const existingEntity = state[id];
      if (!existingEntity || isError(existingEntity)) {
        return assign({}, state, { [id]: responseAction });
      }

      console.log('Error: fetching failed! Not replacing existing entity.');
      return state;
    case STORE_PROJECTS:
      const projects = (<t.StoreProjectsAction> action).entities;
      if (projects && projects.length > 0) {
        return assign({}, state, responseToStateShape(projects));
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default reducer;
