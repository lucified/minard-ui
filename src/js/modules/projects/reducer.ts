import { merge } from 'lodash';

import { PROJECTS } from './actions';
import * as t from './types';

const initialState: t.ProjectState = {}; /* {
  1: {
    id: '1',
    name: 'First project',
    description: 'This is the first project description. It might not be set.',
    branches: ['1', '2', '3'],
    activeUsers: ['ville.saarinen@lucify.com', 'juho@lucify.com']
  },
  2: {
    id: '2',
    name: 'Second project',
    branches: [],
    activeUsers: ['ville.saarinen@lucify.com']
  },
};*/

export default (state: t.ProjectState = initialState, action: t.LoadProjectsAction) => {
  switch (action.type) {
    case PROJECTS.SUCCESS:
      const projects: t.ProjectState = {};
      const response = <t.ApiResponse>action.response;

      response.data.forEach(project => {
        projects[project.id] = {
          id: project.id,
          name: project.attributes.name,
          description: project.attributes.description,
          branches: project.relationships.branches.data.map((b: { id: string, type: string }) => b.id),
          activeUsers: [],
        };
      });

      return merge({}, state, projects);
    default:
      return state;
  }
};
