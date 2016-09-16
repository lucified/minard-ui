import * as difference from 'lodash/difference';
import * as omit from 'lodash/omit';
import * as unionBy from 'lodash/unionBy';
import { Reducer } from 'redux';

import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';

import {
  ADD_BRANCHES_TO_PROJECT,
  REMOVE_BRANCH_FROM_PROJECT,
  REMOVE_PROJECT,
  STORE_AUTHORS_TO_PROJECT,
  STORE_PROJECTS,
  UPDATE_LATEST_ACTIVITY_TIMESTAMP_FOR_PROJECT,
  UPDATE_LATEST_DEPLOYED_COMMIT_FOR_PROJECT,
  UPDATE_PROJECT,
} from './actions';
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
    case REMOVE_PROJECT:
      id = action.id;
      if (state[id]) {
        return omit<t.ProjectState, t.ProjectState>(state, id);
      }

      console.log('Error: trying to remove a project that does not exist.'); // tslint:disable-line:no-console
      return state;
    case UPDATE_PROJECT:
      const updateProjectAction = <t.UpdateProjectAction> action;
      id = updateProjectAction.id;
      project = state[id];

      if (project && !isFetchError(project)) {
        const { name, description, repoUrl } = updateProjectAction;
        const updatedProject = Object.assign({}, project, { name, description, repoUrl });
        return Object.assign({}, state, { [id]: updatedProject });
      }

      console.log('Error: trying to update nonexistant project.'); // tslint:disable-line:no-console
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
    case STORE_AUTHORS_TO_PROJECT:
      const storeAuthorsAction = <t.StoreAuthorsToProjectAction> action;
      id = storeAuthorsAction.id;
      project = state[id];

      if (project && !isFetchError(project)) {
        if (difference(
          storeAuthorsAction.authors.map(user => user.email),
          project.activeUsers.map(user => user.email)
        ).length === 0) {
          // All users already included
          return state;
        } else {
          const newProject = Object.assign({}, project);
          newProject.activeUsers = unionBy(action.authors, project.activeUsers, (user: t.ProjectUser) => user.email);
          return Object.assign({}, state, { [id]: newProject });
        }
      }

      console.log('Error: trying to add authors to nonexistant project.'); // tslint:disable-line:no-console
      return state;
    case UPDATE_LATEST_ACTIVITY_TIMESTAMP_FOR_PROJECT:
      const updateActivityTimestampAction = <t.UpdateLatestActivityTimestampAction> action;
      id = updateActivityTimestampAction.id;
      project = state[id];

      if (project && !isFetchError(project)) {
        const { timestamp } = updateActivityTimestampAction;
        if (project.latestActivityTimestamp !== timestamp) {
          const newProject = Object.assign({}, project, { latestActivityTimestamp: timestamp });
          return Object.assign({}, state, { [id]: newProject });
        }
      }

      console.log('Error: trying to update timestamp on nonexistant project.'); // tslint:disable-line:no-console
      return state;
    case UPDATE_LATEST_DEPLOYED_COMMIT_FOR_PROJECT:
      const updateLatestCommitAction = <t.UpdateLatestDeployedCommitAction> action;
      id = updateLatestCommitAction.id;
      project = state[id];

      if (project && !isFetchError(project)) {
        const { commit } = updateLatestCommitAction;
        if (project.latestSuccessfullyDeployedCommit !== commit) {
          const newProject = Object.assign({}, project, { latestSuccessfullyDeployedCommit: commit });
          return Object.assign({}, state, { [id]: newProject });
        }
      }

      console.log('Error: trying to update latest deployed commit on nonexistant project.'); // tslint:disable-line
      return state;
    case REMOVE_BRANCH_FROM_PROJECT:
      const removeBranchAction = <t.RemoveBranchAction> action;
      id = removeBranchAction.id;
      project = state[id];

      if (project && !isFetchError(project) && project.branches && !isFetchError(project.branches)) {
        const { branch } = removeBranchAction;
        if (project.branches.indexOf(branch) > -1) {
          const newProject = Object.assign({}, project, {
            branches: project.branches.filter(branchId => branchId !== branch),
          });
          return Object.assign({}, state, { [id]: newProject });
        }
      }

      console.log('Error: trying to remove branch from nonexistant project or project branches.'); // tslint:disable-line
      return state;
    default:
      return state;
  }
};

export default reducer;
