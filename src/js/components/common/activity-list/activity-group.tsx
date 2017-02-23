import * as classNames from 'classnames';
import * as React from 'react';
import * as FlipMove from 'react-flip-move';
import * as Icon from 'react-fontawesome';
import TimeAgo from 'react-timeago';

import { Activity, ActivityType } from '../../../modules/activities';
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
  const { branch, commit, deployment, project, type } = activity;

  if (type === ActivityType.Comment) {
    return (
      <span>
        <Icon className={styles.icon} name="comment-o" />
        {'New comments for '}
        <MinardLink className={styles['metadata-deployment']} preview={deployment} commit={commit}>
          {commit.hash.substr(0, 8)}
        </MinardLink>
        {' in '}
        <MinardLink className={styles['metadata-branch']} branch={branch.id} project={project.id} >
          {branch.name}
        </MinardLink>
      </span>
    );
  }

  if (isSuccessful(deployment)) {
    return (
      <span>
        <Icon className={styles.icon} name="eye" />
        <span className={styles['metadata-author']}>
          {deployment.creator.name || deployment.creator.email}
        </span>
        {' generated a preview for '}
        <MinardLink className={styles['metadata-deployment']} preview={deployment} commit={commit}>
          {commit.hash.substr(0, 8)}
        </MinardLink>
        {' in '}
        <MinardLink className={styles['metadata-branch']} branch={branch.id} project={project.id} >
          {branch.name}
        </MinardLink>
      </span>
    );
  }

  return (
    <span>
      <Icon className={styles.icon} name="times" />
      {`Preview generation for ${commit.hash.substring(0, 8)} failed in `}
      <MinardLink className={styles['metadata-branch']} branch={branch.id} project={project.id} >
        {branch.name}
      </MinardLink>
    </span>
  );
};

class ActivityGroup extends React.Component<PassedProps, void> {
  public render() {
    const { activities, showProjectName } = this.props;
    const firstActivity = activities[activities.length - 1];
    const latestActivity = activities[0];

    return (
      <div className={classNames('row', styles['activity-group'])}>
        <div className={classNames('col-xs-1', styles.timestamp)}>
          <TimeAgo minPeriod={10} date={latestActivity.timestamp} />
        </div>
        <div className={classNames('col-xs-2', styles.screenshot)}>
          {isSuccessful(firstActivity.deployment) && (
            <MinardLink preview={firstActivity.deployment} commit={firstActivity.commit}>
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
            <FlipMove enterAnimation="fade" leaveAnimation="fade">
              {activities.slice(0, -1).map(activity => (
                <div key={activity.id}>
                  <SingleActivity activity={activity} />
                  <hr className={styles.line} />
                </div>
              ))}
            </FlipMove>
            <div>
              <SingleActivity activity={firstActivity} />
            </div>
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
