import * as classNames from 'classnames';
import * as React from 'react';
import * as FlipMove from 'react-flip-move';
import TimeAgo from 'react-timeago';

import { Activity } from '../../../modules/activities';
import { isSuccessful } from '../../../modules/deployments';

import DeploymentScreenshot from '../deployment-screenshot';
import LoadingIcon from '../loading-icon';
import MinardLink from '../minard-link';
import SingleActivity from './single-activity';

const styles = require('./activity-group.scss');

interface PassedProps {
  activities: Activity[];
  showProjectName?: boolean;
}

const getProjectLabel = ({ project }: Activity) => {
  return (
    <span>
      {' in '}
      <MinardLink className={styles['metadata-project']} project={project.id}>
        {project.name}
      </MinardLink>
    </span>
  );
};

const getMetadata = (activity: Activity) => {
  const { branch, project } = activity;

  return (
    <span>
      {'Activity in '}
      <MinardLink className={styles['metadata-branch']} branch={branch.id} project={project.id} >
        {branch.name}
      </MinardLink>
    </span>
  );
};

class ActivityGroup extends React.Component<PassedProps, any> {
  public render() {
    const { activities, showProjectName } = this.props;
    const firstActivity = activities[0];

    return (
      <div className={classNames('row', styles['activity-group'])}>
        <div className={classNames('col-xs-1', styles.timestamp)}>
          <TimeAgo minPeriod={10} date={firstActivity.timestamp} />
        </div>
        <div className={classNames('col-xs-2', styles.screenshot)}>
          {isSuccessful(firstActivity.deployment) && (
            <MinardLink deployment={firstActivity.deployment} openInNewWindow>
              <DeploymentScreenshot deployment={firstActivity.deployment} />
            </MinardLink>
          )}
        </div>
        <div className={classNames('col-xs-9', styles['activity-content'])}>
          <div className={styles.activity}>
            <div className={styles.metadata}>
              <div className={styles.action}>
                {getMetadata(firstActivity)}
                {showProjectName && getProjectLabel(firstActivity)}
              </div>
              <div className={styles.share}>
                {/* TODO: add share link */}
              </div>
            </div>
            <div>
              <SingleActivity activity={firstActivity} />
            </div>
            <FlipMove enterAnimation="elevator" leaveAnimation="elevator">
              {activities.slice(1).map(activity => (
                <div key={activity.id}>
                  <hr className={styles.line} />
                  <SingleActivity activity={activity} />
                </div>
              ))}
            </FlipMove>
          </div>
        </div>
      </div>
    );
  }
}

export default ActivityGroup;

export const LoadingActivityGroup = () => (
  <div className={classNames('row', 'middle-xs', 'between-xs', styles['activity-group'], styles.loading)}>
    <div className={classNames('col-xs-12')}>
      <LoadingIcon center />
    </div>
  </div>
);
