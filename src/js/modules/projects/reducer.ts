import { merge } from 'lodash';

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
    merge(obj, { [project.id]: createProjectObject(project) }), {});
};

export default (state: t.ProjectState = initialState, action: any) => {
  switch (action.type) {
    case ALL_PROJECTS.SUCCESS:
      const projectsResponse = (<t.RequestAllProjectsAction> action).response;
      return merge({}, state, responseToStateShape(projectsResponse));
    case PROJECT.SUCCESS:
      const projectResponse = (<t.RequestProjectAction> action).response;
      return merge({}, state, responseToStateShape([projectResponse]));
    case STORE_PROJECTS:
      const projects = (<t.StoreProjectsAction> action).projects;
      return merge({}, state, responseToStateShape(projects));
    default:
      return state;
  }
};
