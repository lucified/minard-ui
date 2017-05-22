import { omit, unionBy, uniq, xor } from 'lodash';
import { Reducer } from 'redux';

import { logMessage } from '../../logger';
import { DeleteError, FetchError, isFetchError } from '../errors';
import Requests from '../requests';
import { CLEAR_STORED_DATA } from '../user';

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
import {
  AddBranchesToProjectAction,
  Project,
  ProjectState,
  ProjectUser,
  RemoveBranchAction,
  RemoveProjectAction,
  StoreAuthorsToProjectAction,
  StoreProjectsAction,
  UpdateLatestActivityTimestampAction,
  UpdateLatestDeployedCommitAction,
  UpdateProjectAction,
} from './types';

const initialState: ProjectState = {};

const reducer: Reducer<ProjectState> = (state = initialState, action: any) => {
  let project: Project | FetchError;
  let id: string;

  switch (action.type) {
    case Requests.actions.Projects.LoadProject.FAILURE.type:
      const responseAction = action as FetchError;
      id = responseAction.id;
      const existingEntity = state[id];
      if (!existingEntity || isFetchError(existingEntity)) {
        return {
          ...state,
          [id]: responseAction,
        };
      }

      logMessage('Fetching failed! Not replacing existing entity.', { action });

      return state;
    case Requests.actions.Branches.LoadBranchesForProject.FAILURE.type:
      const fetchError = action as FetchError;
      project = state[fetchError.id];

      // Only store the FetchError if branches does not exist or it's an error
      if (project && !isFetchError(project) && (!project.branches || isFetchError(project.branches))) {
        return {
          ...state,
          [fetchError.id]: {
            ...project,
            branches: fetchError,
          },
        };
      }

      return state;
    case Requests.actions.Projects.DeleteProject.SUCCESS.type:
    case REMOVE_PROJECT:
      const deleteAction = action as DeleteError | RemoveProjectAction;
      id = deleteAction.id;
      if (state[id]) {
        return omit<ProjectState, ProjectState>(state, id);
      }

      return state;
    case ADD_BRANCHES_TO_PROJECT:
      const { id: projectId, branches } = action as AddBranchesToProjectAction;
      project = state[projectId];

      if (project && !isFetchError(project)) {
        let newBranches: string[];
        if (project.branches && !isFetchError(project.branches) && project.branches.length > 0) {
          newBranches = uniq(project.branches.concat(branches));

          if (xor(project.branches, newBranches).length === 0) {
            // Branches already exist
            return state;
          }
        } else {
          newBranches = branches;
        }

        return {
          ...state,
          [projectId]: {
            ...project,
            branches: newBranches,
          },
        };
      }

      return state;
    case UPDATE_PROJECT:
      const updateProjectAction = action as UpdateProjectAction;
      id = updateProjectAction.id;
      project = state[id];

      if (project && !isFetchError(project)) {
        const { name, description, repoUrl } = updateProjectAction;
        if (project.name !== name || project.description !== description || project.repoUrl !== repoUrl) {
          return {
            ...state,
            [id]: {
              ...project,
              name,
              description,
              repoUrl,
            },
          };
        }
      }

      return state;
    case STORE_PROJECTS:
      const projects = (action as StoreProjectsAction).entities;
      if (projects && projects.length > 0) {
        const newProjects = projects.reduce<ProjectState>((obj, newProject) => {
          // If existing project has branches, store those
          const existingProject = state[newProject.id];
          if (existingProject && !isFetchError(existingProject) && existingProject.branches) {
            newProject.branches = existingProject.branches;
          }

          return Object.assign(obj, { [newProject.id]: newProject });
        }, {});

        return {
          ...state,
          ...newProjects,
        };
      }

      return state;
    case STORE_AUTHORS_TO_PROJECT:
      const storeAuthorsAction = action as StoreAuthorsToProjectAction;
      id = storeAuthorsAction.id;
      project = state[id];

      if (project && !isFetchError(project)) {
        const combinedAuthors = unionBy(project.activeUsers, action.authors, (user: ProjectUser) => user.email);
        if (combinedAuthors.length === project.activeUsers.length) {
          // All users already included
          return state;
        } else {
          return {
            ...state,
            [id]: {
              ...project,
              activeUsers: combinedAuthors,
            },
          };
        }
      }

      return state;
    case UPDATE_LATEST_ACTIVITY_TIMESTAMP_FOR_PROJECT:
      const updateActivityTimestampAction = action as UpdateLatestActivityTimestampAction;
      id = updateActivityTimestampAction.id;
      project = state[id];

      if (project && !isFetchError(project)) {
        const { timestamp } = updateActivityTimestampAction;
        if (project.latestActivityTimestamp !== timestamp) {
          return {
            ...state,
            [id]: {
              ...project,
              latestActivityTimestamp: timestamp,
            },
          };
        }

        return state;
      }

      return state;
    case UPDATE_LATEST_DEPLOYED_COMMIT_FOR_PROJECT:
      const updateLatestCommitAction = action as UpdateLatestDeployedCommitAction;
      id = updateLatestCommitAction.id;
      project = state[id];

      if (project && !isFetchError(project)) {
        const { commit } = updateLatestCommitAction;
        if (project.latestSuccessfullyDeployedCommit !== commit) {
          return {
            ...state,
            [id]: {
              ...project,
              latestSuccessfullyDeployedCommit: commit,
            },
          };
        }

        return state;
      }

      return state;
    case REMOVE_BRANCH_FROM_PROJECT:
      const removeBranchAction = action as RemoveBranchAction;
      id = removeBranchAction.id;
      project = state[id];

      if (project && !isFetchError(project)) {
        if (project.branches && !isFetchError(project.branches)) {
          const { branch } = removeBranchAction;
          if (project.branches.indexOf(branch) > -1) {
            return {
              ...state,
              [id]: {
                ...project,
                branches: project.branches.filter(branchId => branchId !== branch),
              },
            };
          }
        }

        return state;
      }

      return state;
    case CLEAR_STORED_DATA:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
