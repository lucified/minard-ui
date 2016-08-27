import * as React from 'react';

import { Activity } from '../../../modules/activities';

import ActivityGroup, { LoadingActivityGroup } from './activity-group';

const styles = require('./index.scss');

interface Props {
  activities: Activity[];
  showProjectName?: boolean;
  isLoading?: boolean;
  emptyContentHeader: string;
  emptyContentBody: string;
}

const getEmptyContent = (header: string, body: string) => (
  <div className={styles.empty}>
    <h2>{header}</h2>
    <p>{body}</p>
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
