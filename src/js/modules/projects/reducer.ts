import { omit } from 'lodash';
import * as moment from 'moment';
import { Reducer } from 'redux';

import { FetchError, isFetchError } from '../errors';
import { RequestDeleteSuccessAction, RequestFetchCollectionSuccessAction, RequestFetchSuccessAction } from '../types';

import { ALL_PROJECTS, PROJECT, SEND_DELETE_PROJECT, STORE_PROJECTS } from './actions';
import * as t from './types';

const initialState: t.ProjectState = {};

const responseToStateShape = (projects: t.ApiResponse) => {
  const createProjectObject = (project: t.ResponseProjectElement): t.Project => {
    const branches =  (project.relationships.branches &&
       project.relationships.branches.data &&
       project.relationships.branches.data.map(({ id }) => id)) || [];

    return {
      id: project.id,
      name: project.attributes.name,
      description: project.attributes.description,
      branches,
      activeUsers: project.attributes['active-committers'].map(user => ({
        name: user.name,
        email: user.email,
        timestamp: moment(user.timestamp).valueOf(),
      })),
    };
  };

  return projects.reduce((obj, project) => {
    try {
      const stateObject = createProjectObject(project);
      return Object.assign(obj, { [project.id]: stateObject });
    } catch (e) {
      console.log('Error parsing project:', project, e); // tslint:disable-line:no-console
      return obj;
    }
  }, {});
};

const reducer: Reducer<t.ProjectState> = (state = initialState, action: any) => {
  switch (action.type) {
    case ALL_PROJECTS.SUCCESS:
      const projectsResponse = (<RequestFetchCollectionSuccessAction<t.ResponseProjectElement[]>> action).response;
      if (projectsResponse && projectsResponse.length > 0) {
        return Object.assign({}, state, responseToStateShape(projectsResponse));
      }

      return state;
    case PROJECT.SUCCESS:
      const projectResponse = (<RequestFetchSuccessAction<t.ResponseProjectElement>> action).response;
      if (projectResponse) {
        return Object.assign({}, state, responseToStateShape([projectResponse]));
      }

      return state;
    case PROJECT.FAILURE:
      const responseAction = <FetchError> action;
      const id = responseAction.id;
      const existingEntity = state[id];
      if (!existingEntity || isFetchError(existingEntity)) {
        return Object.assign({}, state, { [id]: responseAction });
      }

      console.log('Error: fetching failed! Not replacing existing entity.'); // tslint:disable-line:no-console
      return state;
    case SEND_DELETE_PROJECT.SUCCESS:
      const { id: idToDelete } = (<RequestDeleteSuccessAction> action);
      if (state[idToDelete]) {
        return omit<t.ProjectState, t.ProjectState>(state, idToDelete);
      }

      return state;
    case STORE_PROJECTS:
      const projects = (<t.StoreProjectsAction> action).entities;
      if (projects && projects.length > 0) {
        return Object.assign({}, state, responseToStateShape(projects));
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
