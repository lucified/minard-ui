import * as React from 'react';

import { Activity } from '../../../modules/activities';

import ActivityGroup from './activity-group';

interface Props {
  activities: Activity[];
  showProjectName?: boolean;
}

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

const ActivityList = ({ activities, showProjectName }: Props) => {
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
