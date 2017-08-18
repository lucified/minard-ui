export interface NotificationsState {
  team?: NotificationConfiguration[];
  projects: {
    [id: string]: NotificationConfiguration[];
  };
}

export type NotificationConfiguration =
  | FlowdockNotificationConfiguration
  | SlackNotificationConfiguration
  | HipchatNotificationConfiguration
  | GitHubTeamNotificationConfiguration
  | GitHubProjectNotificationConfiguration;

interface BaseNotificationConfiguration {
  id: string;
  projectId?: string;
  teamId?: number;
}

export interface FlowdockNotificationConfiguration
  extends BaseNotificationConfiguration {
  type: 'flowdock';
  flowToken: string;
}

export function isFlowdockNotificationConfiguration(
  obj: any,
): obj is FlowdockNotificationConfiguration {
  return obj && obj.type && obj.type === 'flowdock' && obj.flowToken;
}

export interface SlackNotificationConfiguration
  extends BaseNotificationConfiguration {
  type: 'slack';
  slackWebhookUrl: string;
}

export function isSlackNotificationConfiguration(
  obj: any,
): obj is SlackNotificationConfiguration {
  return obj && obj.type && obj.type === 'slack' && obj.slackWebhookUrl;
}

export interface HipchatNotificationConfiguration
  extends BaseNotificationConfiguration {
  type: 'hipchat';
  hipchatAuthToken: string;
  hipchatRoomId: number;
}

export function isHipchatNotificationConfiguration(
  obj: any,
): obj is HipchatNotificationConfiguration {
  return (
    obj &&
    obj.type &&
    obj.type === 'hipchat' &&
    obj.hipchatAuthToken &&
    obj.hipchatRoomId != null
  );
}

export interface GitHubTeamNotificationConfiguration
  extends BaseNotificationConfiguration {
  type: 'github';
  teamId: number;
  githubAppId: string;
  githubAppPrivateKey: string;
  githubInstallationId: number;
}

export function isGitHubTeamNotificationConfiguration(
  obj: any,
): obj is GitHubTeamNotificationConfiguration {
  return (
    obj &&
    obj.type &&
    obj.type === 'github' &&
    obj.teamId != null &&
    obj.githubAppId
  );
}

export interface GitHubProjectNotificationConfiguration
  extends BaseNotificationConfiguration {
  type: 'github';
  projectId: string;
  githubOwner: string;
  githubRepo: string;
}

export function isGitHubProjectNotificationConfiguration(
  obj: any,
): obj is GitHubProjectNotificationConfiguration {
  return (
    obj &&
    obj.type &&
    obj.type === 'github' &&
    obj.projectId != null &&
    obj.githubRepo
  );
}

export interface FetchTeamNotificationConfigurationsAction {
  type: 'NOTIFICATIONS/FETCH_TEAM_CONFIGURATIONS';
  id: string;
}

export interface FetchProjectNotificationConfigurationsAction {
  type: 'NOTIFICATIONS/FETCH_PROJECT_CONFIGURATIONS';
  id: string;
}

export interface StoreProjectNotificationConfigurationsAction {
  type: 'NOTIFICATIONS/STORE_PROJECT_CONFIGURATIONS';
  id: string;
  configurations: NotificationConfiguration[];
}

export interface StoreTeamNotificationConfigurationsAction {
  type: 'NOTIFICATIONS/STORE_TEAM_CONFIGURATIONS';
  configurations: NotificationConfiguration[];
}
