import * as React from 'react';

import { Activity } from '../modules/activity';

import ActivityGroup from './activity-group';

interface Props {
  activities: Activity[];
}

class ActivityList extends React.Component<Props, any> {
  private generateDeploymentGroups(activities: Activity[]): Activity[][] {
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
  }

  public render() {
    const { activities } = this.props;
    const groupedActivities = this.generateDeploymentGroups(activities);

    return (
      <div>
        {groupedActivities.map((activityGroup, i) => <ActivityGroup key={i} activities={activityGroup} />)}
      </div>
    );
  }
}

export default ActivityList;
