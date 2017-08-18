import {
  DeleteNotificationAction,
  FetchProjectNotificationConfigurationsAction,
  FetchTeamNotificationConfigurationsAction,
  NotificationConfiguration,
  SetProjectGitHubNotificationsAction,
  StoreProjectNotificationConfigurationsAction,
  StoreTeamNotificationConfigurationsAction,
} from './types';

export const FETCH_TEAM_NOTIFICATION_CONFIGURATIONS =
  'NOTIFICATIONS/FETCH_TEAM_CONFIGURATIONS';
export const fetchTeamNotificationConfigurations = (
  id: string,
): FetchTeamNotificationConfigurationsAction => ({
  type: FETCH_TEAM_NOTIFICATION_CONFIGURATIONS,
  id,
});

export const FETCH_PROJECT_NOTIFICATION_CONFIGURATIONS =
  'NOTIFICATIONS/FETCH_PROJECT_CONFIGURATIONS';
export const fetchProjectNotificationConfigurations = (
  id: string,
): FetchProjectNotificationConfigurationsAction => ({
  type: FETCH_PROJECT_NOTIFICATION_CONFIGURATIONS,
  id,
});

export const STORE_PROJECT_NOTIFICATION_CONFIGURATIONS =
  'NOTIFICATIONS/STORE_PROJECT_CONFIGURATIONS';
export const storeProjectNotificationConfigurations = (
  id: string,
  configurations: NotificationConfiguration[],
): StoreProjectNotificationConfigurationsAction => ({
  type: STORE_PROJECT_NOTIFICATION_CONFIGURATIONS,
  id,
  configurations,
});

export const STORE_TEAM_NOTIFICATION_CONFIGURATIONS =
  'NOTIFICATIONS/STORE_TEAM_CONFIGURATIONS';
export const storeTeamNotificationConfigurations = (
  configurations: NotificationConfiguration[],
): StoreTeamNotificationConfigurationsAction => ({
  type: STORE_TEAM_NOTIFICATION_CONFIGURATIONS,
  configurations,
});

export const SET_PROJECT_GITHUB_NOTIFICATIONS =
  'NOTIFICATIONS/SET_PROJECT_GITHUB_NOTIFICATIONS';
export const setProjectGitHubNotifications = (
  projectId: string,
  owner: string,
  repo: string,
): SetProjectGitHubNotificationsAction => ({
  type: SET_PROJECT_GITHUB_NOTIFICATIONS,
  id: projectId,
  owner,
  repo,
});

export const DELETE_NOTIFICATION = 'NOTIFICATIONS/DELETE_NOTIFICATION';
export const deleteNotification = (id: string): DeleteNotificationAction => ({
  type: DELETE_NOTIFICATION,
  id,
});
