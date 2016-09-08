import { prettyErrorMessage } from '../common';

import * as t from './types';

const createActionNames = (prefix: string) => ({
  requestAction: `REQUESTS/${prefix}/REQUEST`,
  successAction: `REQUESTS/${prefix}/SUCCESS`,
  failureAction: `REQUESTS/${prefix}/FAILURE`,
});

const fetchEntityActionCreators = (prefix: string): t.FetchEntityActionCreators => {
  const { requestAction, successAction, failureAction } = createActionNames(prefix);

  return {
    REQUEST: {
      type: requestAction,
      actionCreator: (id: string) => ({ type: requestAction, id }),
    },
    SUCCESS: {
      type: successAction,
      actionCreator: (id: string) => ({ type: successAction, id }),
    },
    FAILURE: {
      type: failureAction,
      actionCreator: (id: string, error: string, details: string) => ({
        type: failureAction,
        id,
        error,
        details,
        prettyError: prettyErrorMessage(error),
      }),
    },
  };
};

const createEntityActionCreators = (prefix: string): t.CreateEntityActionCreators => {
  const { requestAction, successAction, failureAction } = createActionNames(prefix);

  return {
    REQUEST: {
      type: requestAction,
      actionCreator: (name: string) => ({ type: requestAction, name }),
    },
    SUCCESS: {
      type: successAction,
      actionCreator: (name: string) => ({ type: successAction, name }),
    },
    FAILURE: {
      type: failureAction,
      actionCreator: (name: string, error: string, details: string) => ({
        type: failureAction,
        name,
        error,
        details,
        prettyError: prettyErrorMessage(error),
      }),
    },
  };
};

const editEntityActionCreators = (prefix: string): t.EditEntityActionCreators => {
  const { requestAction, successAction, failureAction } = createActionNames(prefix);

  return {
    REQUEST: {
      type: requestAction,
      actionCreator: (id: string) => ({ type: requestAction, id }),
    },
    SUCCESS: {
      type: successAction,
      actionCreator: (id: string) => ({ type: successAction, id }),
    },
    FAILURE: {
      type: failureAction,
      actionCreator: (id: string, error: string, details: string) => ({
        type: failureAction,
        id,
        error,
        details,
        prettyError: prettyErrorMessage(error),
      }),
    },
  };
};

const deleteEntityActionCreators = (prefix: string): t.DeleteEntityActionCreators => {
  const { requestAction, successAction, failureAction } = createActionNames(prefix);

  return {
    REQUEST: {
      type: requestAction,
      actionCreator: (id: string) => ({ type: requestAction, id }),
    },
    SUCCESS: {
      type: successAction,
      actionCreator: (id: string) => ({ type: successAction, id }),
    },
    FAILURE: {
      type: failureAction,
      actionCreator: (id: string, error: string, details: string) => ({
        type: failureAction,
        id,
        error,
        details,
        prettyError: prettyErrorMessage(error),
      }),
    },
  };
};

const fetchCollectionActionCreators = (prefix: string): t.CollectionActionCreators => {
  const { requestAction, successAction, failureAction } = createActionNames(prefix);

  return {
    REQUEST: {
      type: requestAction,
      actionCreator: () => ({ type: requestAction }),
    },
    SUCCESS: {
      type: successAction,
      actionCreator: () => ({ type: successAction }),
    },
    FAILURE: {
      type: failureAction,
      actionCreator: (error: string, details: string) => ({
        type: failureAction,
        error,
        details,
        prettyError: prettyErrorMessage(error),
      }),
    },
  };
};

export const Projects = {
  LoadProject: fetchEntityActionCreators('PROJECTS/LOAD_PROJECT'),
  LoadAllProjects: fetchCollectionActionCreators('PROJECTS/LOAD_ALL_PROJECTS'),
  CreateProject: createEntityActionCreators('PROJECTS/CREATE_PROJECT'),
  EditProject: editEntityActionCreators('PROJECTS/EDIT_PROJECT'),
  DeleteProject: deleteEntityActionCreators('PROJECTS/DELETE_PROJECT'),
};

export const Branches = {
  LoadBranch: fetchEntityActionCreators('BRANCHES/LOAD_BRANCH'),
  LoadBranchesForProject: fetchEntityActionCreators('BRANCHES/LOAD_BRANCHES_FOR_PROJECT'),
};

export const Commits = {
  LoadCommit: fetchEntityActionCreators('COMMITS/LOAD_COMMIT'),
  LoadCommitsForBranch: fetchEntityActionCreators('COMMITS/LOAD_COMMITS_FOR_BRANCH'),
};

export const Deployments = {
  LoadDeployment: fetchEntityActionCreators('DEPLOYMENTS/LOAD_DEPLOYMENT'),
};

export const Activities = {
  LoadAllActivities: fetchCollectionActionCreators('ACTIVITIES/LOAD_ALL_ACTIVITIES'),
  LoadActivitiesForProject: fetchEntityActionCreators('ACTIVITIES/LOAD_ACTIVITIES_FOR_PROJECT'),
};
