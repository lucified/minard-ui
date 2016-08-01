import { merge } from 'lodash';

import { PROJECT, PROJECTS, STORE_PROJECTS } from './actions';
import * as t from './types';

const initialState: t.ProjectState = {};

const responseToStateShape = (projects: t.ApiResponse) => {
  const projectObjects: t.ProjectState = {};

  projects.forEach(project => {
    projectObjects[project.id] = {
      id: project.id,
      name: project.attributes.name,
      description: project.attributes.description,
      branches: project.relationships.branches.data.map(({ id }) => id),
      activeUsers: project.attributes.activeCommiters,
    };
  });

  return projectObjects;
};

export default (state: t.ProjectState = initialState, action: any) => {
  switch (action.type) {
    case PROJECTS.SUCCESS:
      const projectsResponse = (<t.LoadAllProjectsAction> action).response;
      return merge({}, state, responseToStateShape(projectsResponse));
    case PROJECT.SUCCESS:
      const projectResponse = (<t.LoadProjectAction> action).response;
      return merge({}, state, responseToStateShape([projectResponse]));
    case STORE_PROJECTS:
      const projects = (<t.StoreProjectsAction> action).projects;
      return merge({}, state, responseToStateShape(projects));
    default:
      return state;
  }
};
