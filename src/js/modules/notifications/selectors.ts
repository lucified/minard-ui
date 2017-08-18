import { StateTree } from '../../reducers';

import { NotificationConfiguration, NotificationsState } from './types';

const selectNotificationsTree = (state: StateTree): NotificationsState =>
  state.entities.notifications;

export const getProjectNotificationConfigurations = (
  state: StateTree,
  id: string,
): NotificationConfiguration[] | undefined =>
  selectNotificationsTree(state).projects[id];

export const getTeamNotificationConfigurations = (
  state: StateTree,
): NotificationConfiguration[] | undefined =>
  selectNotificationsTree(state).team;
