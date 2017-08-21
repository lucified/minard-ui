import {
  CreateError,
  DeleteError,
  EditError,
  FetchCollectionError,
  FetchError,
} from '../errors';

import {
  AllActivitiesRequestedAction,
  AllActivitiesRequestedForProjectAction,
  CollectionActionCreators,
  CreateEntityActionCreators,
  DeleteEntityActionCreators,
  EditEntityActionCreators,
  FetchEntityActionCreators,
} from './types';

const createActionNames = (prefix: string) => ({
  requestAction: `REQUESTS/${prefix}/REQUEST`,
  successAction: `REQUESTS/${prefix}/SUCCESS`,
  failureAction: `REQUESTS/${prefix}/FAILURE`,
});

const prettyErrorMessage = (error: string): string => {
  // Unable to parse JSON. Might happen from a 404
  if (error.indexOf('Unexpected token') >= 0) {
    return 'Error understanding response';
  }

  // Can't connect to server
  if (error.indexOf('Failed to fetch') >= 0) {
    return 'Unable to connect';
  }

  return error;
};

const fetchEntityActionCreators = (
  prefix: string,
): FetchEntityActionCreators => {
  const { requestAction, successAction, failureAction } = createActionNames(
    prefix,
  );

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
      actionCreator: (
        id: string,
        error: string,
        details: string,
        unauthorized?: boolean,
      ): FetchError => ({
        type: failureAction,
        id,
        error,
        details,
        prettyError: prettyErrorMessage(error),
        unauthorized,
      }),
    },
  };
};

const createEntityActionCreators = (
  prefix: string,
): CreateEntityActionCreators => {
  const { requestAction, successAction, failureAction } = createActionNames(
    prefix,
  );

  return {
    REQUEST: {
      type: requestAction,
      actionCreator: (name: string) => ({ type: requestAction, name }),
    },
    SUCCESS: {
      type: successAction,
      actionCreator: (entity: any, name: string) => ({
        type: successAction,
        result: entity,
        name,
      }),
    },
    FAILURE: {
      type: failureAction,
      actionCreator: (
        name: string,
        error: string,
        details: string,
        unauthorized?: boolean,
      ): CreateError => ({
        type: failureAction,
        name,
        error,
        details,
        prettyError: prettyErrorMessage(error),
        unauthorized,
      }),
    },
  };
};

const editEntityActionCreators = (prefix: string): EditEntityActionCreators => {
  const { requestAction, successAction, failureAction } = createActionNames(
    prefix,
  );

  return {
    REQUEST: {
      type: requestAction,
      actionCreator: (id: string) => ({ type: requestAction, id }),
    },
    SUCCESS: {
      type: successAction,
      actionCreator: (entity: any) => ({ type: successAction, result: entity }),
    },
    FAILURE: {
      type: failureAction,
      actionCreator: (
        id: string,
        error: string,
        details: string,
        unauthorized?: boolean,
      ): EditError => ({
        type: failureAction,
        id,
        error,
        details,
        prettyError: prettyErrorMessage(error),
        unauthorized,
      }),
    },
  };
};

const deleteEntityActionCreators = (
  prefix: string,
): DeleteEntityActionCreators => {
  const { requestAction, successAction, failureAction } = createActionNames(
    prefix,
  );

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
      actionCreator: (
        id: string,
        error: string,
        details: string,
        unauthorized?: boolean,
      ): DeleteError => ({
        type: failureAction,
        id,
        error,
        details,
        prettyError: prettyErrorMessage(error),
        unauthorized,
      }),
    },
  };
};

const fetchCollectionActionCreators = (
  prefix: string,
): CollectionActionCreators => {
  const { requestAction, successAction, failureAction } = createActionNames(
    prefix,
  );

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
      actionCreator: (
        error: string,
        details: string,
        unauthorized?: boolean,
      ): FetchCollectionError => ({
        type: failureAction,
        error,
        details,
        prettyError: prettyErrorMessage(error),
        unauthorized,
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
  SetProjectVisibility: editEntityActionCreators('PROJECTS/SET_VISIBILITY'),
  LoadNotificationConfigurations: fetchEntityActionCreators(
    'PROJECTS/LOAD_NOTIFICATION_CONFIGURATIONS',
  ),
  CreateNotification: createEntityActionCreators(
    'PROJECTS/CREATE_NOTIFICATION',
  ),
};

export const Branches = {
  LoadBranch: fetchEntityActionCreators('BRANCHES/LOAD_BRANCH'),
  LoadBranchesForProject: fetchEntityActionCreators(
    'BRANCHES/LOAD_BRANCHES_FOR_PROJECT',
  ),
};

export const Comments = {
  LoadCommentsForDeployment: fetchEntityActionCreators(
    'COMMENTS/LOAD_COMMENTS_FOR_DEPLOYMENT',
  ),
  CreateComment: createEntityActionCreators('COMMENTS/CREATE_COMMENT'),
  DeleteComment: deleteEntityActionCreators('COMMENTS/DELETE_ENTITY'),
};

export const Commits = {
  LoadCommit: fetchEntityActionCreators('COMMITS/LOAD_COMMIT'),
  LoadCommitsForBranch: fetchEntityActionCreators(
    'COMMITS/LOAD_COMMITS_FOR_BRANCH',
  ),
};

export const Deployments = {
  LoadDeployment: fetchEntityActionCreators('DEPLOYMENTS/LOAD_DEPLOYMENT'),
};

export const Previews = {
  LoadPreview: fetchEntityActionCreators('PREVIEWS/LOAD_PREVIEW'),
};

export const Activities = {
  LoadAllActivities: fetchCollectionActionCreators(
    'ACTIVITIES/LOAD_ALL_ACTIVITIES',
  ),
  LoadActivitiesForProject: fetchEntityActionCreators(
    'ACTIVITIES/LOAD_ACTIVITIES_FOR_PROJECT',
  ),
};

export const Team = {
  LoadTeamInformation: fetchCollectionActionCreators(
    'TEAM/LOAD_TEAM_INFORMATION',
  ),
  LoadNotificationConfigurations: fetchEntityActionCreators(
    'TEAM/LOAD_NOTIFICATION_CONFIGURATIONS',
  ),
};

export const Notifications = {
  Delete: deleteEntityActionCreators('NOTIFICATIONS/DELETE_NOTIFICATION'),
};

// This action is created once all activities have been requested from the server
export const ALL_ACTIVITIES_REQUESTED = 'ACTIVITIES/ALL_ACTIVITIES_REQUESTED';
export const allActivitiesRequested = (): AllActivitiesRequestedAction => ({
  type: ALL_ACTIVITIES_REQUESTED,
});

// This action is created once all activities for a project have been requested from the server
export const ALL_ACTIVITIES_REQUESTED_FOR_PROJECT =
  'ACTIVITIES/ALL_ACTIVITIES_REQUESTED_FOR_PROJECT';
export const allActivitiesRequestedForProject = (
  id: string,
): AllActivitiesRequestedForProjectAction => ({
  type: ALL_ACTIVITIES_REQUESTED_FOR_PROJECT,
  id,
});
