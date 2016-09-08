import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';

import { Activity } from '../../../modules/activities';

import DeploymentScreenshot from '../deployment-screenshot';
import LoadingIcon from '../loading-icon';
import MinardLink from '../minard-link';
import SingleActivity from './single-activity';

const styles = require('./activity-group.scss');

interface PassedProps {
  activities: Activity[];
  showProjectName?: boolean;
}

const ActivityGroup = (props: PassedProps) => {
  const { activities, showProjectName } = props;
  const firstActivity = activities[0];

  return (
    <div className={classNames('row', styles['activity-group'])}>
      <div className={classNames('col-xs-1', styles.timestamp)}>
        {moment(firstActivity.timestamp).fromNow()}
      </div>
      <div className={classNames('col-xs-2', styles.screenshot)}>
        {(firstActivity.deployment.status === 'success') && (
          <MinardLink deployment={firstActivity.deployment} openInNewWindow>
            <DeploymentScreenshot deployment={firstActivity.deployment} />
          </MinardLink>
        )}
      </div>
      <div className={classNames('col-xs-9', styles['activity-content'])}>
        <div>
          <SingleActivity
            activity={activities[0]}
            showProjectName={showProjectName}
          />
        </div>
        {activities.slice(1).map(activity =>
          <div key={activity.id}>
            <hr className={styles.line} />
            <SingleActivity
              activity={activity}
              showProjectName={showProjectName}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityGroup;

export const LoadingActivityGroup = () => (
  <div className={classNames('row', 'middle-xs', 'between-xs', styles['activity-group'], styles.loading)}>
    <div className={classNames('col-xs-12')}>
      <LoadingIcon center />
    </div>
  </div>
);
