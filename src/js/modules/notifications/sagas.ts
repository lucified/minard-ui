import { call, Effect, put, select, takeEvery } from 'redux-saga/effects';

import { toNotificationConfigurations } from '../../api/convert';
import { Api, ApiEntityResponse } from '../../api/types';
import Requests from '../requests';
import {
  DELETE_NOTIFICATION,
  deleteNotification as deleteNotificationActionCreator,
  FETCH_PROJECT_NOTIFICATION_CONFIGURATIONS,
  FETCH_TEAM_NOTIFICATION_CONFIGURATIONS,
  SET_PROJECT_GITHUB_NOTIFICATIONS,
  storeProjectNotificationConfigurations,
  storeTeamNotificationConfigurations,
} from './actions';
import { getProjectNotificationConfigurations } from './selectors';
import {
  DeleteNotificationAction,
  FetchProjectNotificationConfigurationsAction,
  FetchTeamNotificationConfigurationsAction,
  NotificationConfiguration,
  SetProjectGitHubNotificationsAction,
} from './types';

export default function createSagas(api: Api) {
  function* fetchTeamNotificationConfigurations(
    action: FetchTeamNotificationConfigurationsAction,
  ): IterableIterator<Effect> {
    const { id } = action;
    yield put(
      Requests.actions.Team.LoadNotificationConfigurations.REQUEST.actionCreator(
        id,
      ),
    );

    const {
      response,
      error,
      details,
      unauthorized,
    }: {
      response?: ApiEntityResponse;
      error?: string;
      details?: string;
      unauthorized?: boolean;
    } = yield call(api.Team.fetchNotifications, id);

    if (response) {
      const configurations: NotificationConfiguration[] = yield call(
        toNotificationConfigurations,
        response.data,
      );
      yield put(storeTeamNotificationConfigurations(configurations));

      yield put(
        Requests.actions.Team.LoadNotificationConfigurations.SUCCESS.actionCreator(
          id,
        ),
      );

      return true;
    } else {
      yield put(
        Requests.actions.Team.LoadNotificationConfigurations.FAILURE.actionCreator(
          id,
          error!,
          details,
          unauthorized,
        ),
      );

      return false;
    }
  }

  function* fetchProjectNotificationConfigurations(
    action: FetchProjectNotificationConfigurationsAction,
  ): IterableIterator<Effect> {
    const { id } = action;
    yield put(
      Requests.actions.Projects.LoadNotificationConfigurations.REQUEST.actionCreator(
        id,
      ),
    );

    const {
      response,
      error,
      details,
      unauthorized,
    }: {
      response?: ApiEntityResponse;
      error?: string;
      details?: string;
      unauthorized?: boolean;
    } = yield call(api.Project.fetchNotifications, id);

    if (response) {
      const configurations: NotificationConfiguration[] = yield call(
        toNotificationConfigurations,
        response.data,
      );
      yield put(storeProjectNotificationConfigurations(id, configurations));

      yield put(
        Requests.actions.Projects.LoadNotificationConfigurations.SUCCESS.actionCreator(
          id,
        ),
      );

      return true;
    } else {
      yield put(
        Requests.actions.Projects.LoadNotificationConfigurations.FAILURE.actionCreator(
          id,
          error!,
          details,
          unauthorized,
        ),
      );

      return false;
    }
  }

  function* setProjectGitHubNotifications(
    action: SetProjectGitHubNotificationsAction,
  ): IterableIterator<Effect> {
    const { id, owner, repo } = action;

    yield put(
      Requests.actions.Projects.CreateNotification.REQUEST.actionCreator(id),
    );

    // First delete existing notification if it exists
    const projectNotifications:
      | NotificationConfiguration[]
      | undefined = yield select(getProjectNotificationConfigurations, id);
    if (projectNotifications && projectNotifications[0]) {
      const deletionResult = yield call(
        deleteNotification,
        deleteNotificationActionCreator(projectNotifications[0].id),
      );
      if (!deletionResult) {
        // TODO: show this in UI
        console.error('Unable to delete previous GitHub configuration');
        yield put(
          Requests.actions.Projects.CreateNotification.FAILURE.actionCreator(
            id,
            'Previous notification configuration deletion failed',
          ),
        );
        return false;
      }
    }

    // Then set new values
    const { response, error, details, unauthorized } = yield call(
      api.Notification.create,
      {
        type: 'github',
        projectId: id,
        githubOwner: owner,
        githubRepo: repo,
      },
    );

    if (response) {
      const configurations: NotificationConfiguration[] = yield call(
        toNotificationConfigurations,
        response.data,
      );
      yield put(storeProjectNotificationConfigurations(id, configurations));

      yield put(
        Requests.actions.Projects.CreateNotification.SUCCESS.actionCreator(
          configurations,
          id,
        ),
      );

      return true;
    } else {
      yield put(
        Requests.actions.Projects.CreateNotification.FAILURE.actionCreator(
          id,
          error!,
          details,
          unauthorized,
        ),
      );

      return false;
    }
  }

  function* deleteNotification(
    action: DeleteNotificationAction,
  ): IterableIterator<Effect> {
    const { id } = action;

    yield put(Requests.actions.Notifications.Delete.REQUEST.actionCreator(id));

    const { response, error, details, unauthorized } = yield call(
      api.Notification.delete,
      id,
    );

    if (response) {
      yield put(
        Requests.actions.Notifications.Delete.SUCCESS.actionCreator(id),
      );

      return true;
    } else {
      yield put(
        Requests.actions.Notifications.Delete.FAILURE.actionCreator(
          id,
          error,
          details,
          unauthorized,
        ),
      );

      return false;
    }
  }

  return {
    sagas: [
      takeEvery(
        FETCH_TEAM_NOTIFICATION_CONFIGURATIONS,
        fetchTeamNotificationConfigurations,
      ),
      takeEvery(
        FETCH_PROJECT_NOTIFICATION_CONFIGURATIONS,
        fetchProjectNotificationConfigurations,
      ),
      takeEvery(
        SET_PROJECT_GITHUB_NOTIFICATIONS,
        setProjectGitHubNotifications,
      ),
      takeEvery(DELETE_NOTIFICATION, deleteNotification),
    ],
  };
}
