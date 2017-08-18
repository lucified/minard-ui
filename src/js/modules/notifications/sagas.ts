import { call, Effect, put, takeEvery } from 'redux-saga/effects';

import { toNotificationConfigurations } from '../../api/convert';
import { Api, ApiEntityResponse } from '../../api/types';
import Requests from '../requests';
import {
  FETCH_PROJECT_NOTIFICATION_CONFIGURATIONS,
  FETCH_TEAM_NOTIFICATION_CONFIGURATIONS,
  storeProjectNotificationConfigurations,
  storeTeamNotificationConfigurations,
} from './actions';
import {
  FetchProjectNotificationConfigurationsAction,
  FetchTeamNotificationConfigurationsAction,
  NotificationConfiguration,
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
    ],
  };
}
