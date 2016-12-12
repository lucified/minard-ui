import * as React from 'react';
import * as FlipMove from 'react-flip-move';
import * as Waypoint from 'react-waypoint';

import { Activity } from '../../../modules/activities';

import ActivityGroup, { LoadingActivityGroup } from './activity-group';

const styles = require('./index.scss');

interface Props {
  activities: Activity[];
  showProjectName?: boolean;
  isLoading: boolean;
  allLoaded: boolean;
  loadActivities: (count: number, until?: number) => void;
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
    if (activity.deployment.id !== lastGroup[0].deployment.id) {
      lastGroup = [activity];
      groupedActivities.push(lastGroup);
    } else {
      lastGroup.push(activity);
    }
  });

  return groupedActivities;
};

class ActivityList extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);

    this.loadMoreActivities = this.loadMoreActivities.bind(this);
  }

  private loadMoreActivities() {
    const { loadActivities, activities } = this.props;

    loadActivities(10, activities[activities.length - 1].timestamp);
  }

  public render() {
    const { activities, emptyContentHeader, emptyContentBody } = this.props;
    const { showProjectName, allLoaded, isLoading } = this.props;

    if (activities.length === 0) {
      if (isLoading) {
        return <LoadingActivityGroup />;
      }

      return getEmptyContent(emptyContentHeader, emptyContentBody);
    }

    const groupedActivities = generateDeploymentGroups(activities);

    return (
      <div>
        <FlipMove enterAnimation="elevator" leaveAnimation="elevator">
          {groupedActivities.map(activityGroup => {
            const latestActivity = activityGroup[0];
            return (
              <ActivityGroup
                key={`${latestActivity.deployment.id}-${latestActivity.timestamp}`}
                activities={activityGroup}
                showProjectName={showProjectName}
              />
            );
          })}
        </FlipMove>
        {isLoading && <LoadingActivityGroup />}
        {!isLoading && !allLoaded &&
          <Waypoint
            bottomOffset="-300px" // Start loading new activities when the waypoint is 300px below the window
            onEnter={this.loadMoreActivities}
          />
        }
      </div>
    );
  }
}

export default ActivityList;
