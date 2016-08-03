import { merge } from 'lodash';

import { PROJECT, ALL_PROJECTS, STORE_PROJECTS } from './actions';
import * as t from './types';

const initialState: t.ProjectState = {};

const responseToStateShape = (projects: t.ApiResponse) => {
  const projectObjects: t.ProjectState = {};

  projects.forEach(project => {
    const branches =  project.relationships.branches &&
       project.relationships.branches.data &&
       project.relationships.branches.data.map(({ id }) => id);

    projectObjects[project.id] = {
      id: project.id,
      name: project.attributes.name,
      description: project.attributes.description,
      branches,
      activeUsers: project.attributes.activeCommiters,
    };
  });

  return projectObjects;
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
