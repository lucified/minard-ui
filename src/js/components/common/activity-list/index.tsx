import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Activity } from '../../../modules/activities';

import ActivityGroup, { LoadingActivityGroup } from './activity-group';

interface Props {
  activities: Activity[];
  showProjectName?: boolean;
  isLoading?: boolean;
  emptyContentHeader: string;
  emptyContentBody: string;
}

const getEmptyContent = (header: string, body: string) => (
  <div className="empty">
    <Icon name="code-fork" fixedWidth size="3x" />
    <p className="empty-title">{header}</p>
    <p className="empty-meta">{body}</p>
  </div>
);

// Group activities by subsequent actions to the same deployment.
const generateDeploymentGroups = (activities: Activity[]): Activity[][] => {
  let lastGroup = [activities[0]];
  const groupedActivities = [lastGroup];

  activities.slice(1).forEach(activity => {
    if (activity.deployment !== lastGroup[0].deployment) {
      lastGroup = [activity];
      groupedActivities.push(lastGroup);
    } else {
      lastGroup.push(activity);
    }
  });

  return groupedActivities;
};

const ActivityList = ({ activities, emptyContentHeader, emptyContentBody, showProjectName, isLoading }: Props) => {
  if (activities.length === 0) {
    if (isLoading) {
      return <LoadingActivityGroup />;
    }

    return getEmptyContent(emptyContentHeader, emptyContentBody);
  }

  const groupedActivities = generateDeploymentGroups(activities);

  return (
    <div>
      {groupedActivities.map((activityGroup, i) => // TODO: key should be a bit smarter
        <ActivityGroup key={i} activities={activityGroup} showProjectName={showProjectName} />
      )}
    </div>
  );
};

export default ActivityList;
