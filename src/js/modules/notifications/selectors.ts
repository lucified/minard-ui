import { StateTree } from '../../reducers';

import { NotificationConfiguration, NotificationsState } from './types';

const selectNotificationsTree = (state: StateTree): NotificationsState =>
  state.entities.notifications;

/**
 * Undefined when notifications haven't been fetched yet.
 */
export const getProjectNotificationConfigurations = (
  state: StateTree,
  id: string,
): NotificationConfiguration[] | undefined =>
  selectNotificationsTree(state).projects[id];

/**
 * Undefined when notifications haven't been fetched yet.
 */
export const getTeamNotificationConfigurations = (
  state: StateTree,
): NotificationConfiguration[] | undefined =>
  selectNotificationsTree(state).team;
