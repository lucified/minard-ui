import * as classNames from 'classnames';
import * as React from 'react';
import * as FlipMove from 'react-flip-move';
import Icon = require('react-fontawesome');
import TimeAgo from 'react-timeago';

import { Activity, ActivityType } from '../../../modules/activities';
import { isSuccessful } from '../../../modules/deployments';

import Avatar from '../../common/avatar';
import BuildStatus from '../../common/build-status';
import DeploymentScreenshot from '../deployment-screenshot';
import LoadingIcon from '../loading-icon';
import MinardLink from '../minard-link';
import SingleComment from '../single-comment';

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

const getBranchLabel = ({ branch, project }: Activity) => {
  return (
    <span>
      <MinardLink className={styles['metadata-branch']} branch={branch.id} project={project.id} >
        {branch.name}
      </MinardLink>
    </span>
  );
};

class ActivityGroup extends React.Component<PassedProps, void> {
  public render() {
    const { activities, showProjectName } = this.props;
    const deploymentTime = activities[0].deployment.creator.timestamp;
    const firstActivity = activities[activities.length - 1];
    const commentActivities = activities.filter(activity => activity.type === ActivityType.Comment);
    const deployment = firstActivity.deployment;
    const commit = firstActivity.commit;

    return (
      <div className={classNames(styles.root)}>
        <div className={styles.top}>
          <div className={styles.main}>
            <div className={styles['time-and-branch']}>
              <TimeAgo minPeriod={10} date={deploymentTime} />
              {' '}&middot;{' '}
              {getBranchLabel(firstActivity)}
              { showProjectName && (
                <span>
                  {' '}in {getProjectLabel(firstActivity)}
                </span>
              )}
            </div>
            <div className={styles['deployment-details']}>
              <div className={styles.avatar}>
                <Avatar email={deployment.creator.email} size="40" title={name} />
              </div>
              <div className={styles['deployment-details-name-and-message']}>
                <div className={styles['deployment-details-name']}>
                  {commit.author.name}
                </div>
                <div className={styles['deployment-details-message']}>
                  {commit.message}
                </div>
              </div>
            </div>
          </div>
            {isSuccessful(firstActivity.deployment) ? (
              <div className={styles.screenshot}>
                <MinardLink preview={deployment} commit={firstActivity.commit}>
                  <DeploymentScreenshot deployment={deployment} />
                </MinardLink>
              </div>
            ) : (
              <div className={styles['build-error']}>
                <BuildStatus
                  deployment={deployment}
                  commit={commit}
                  latest={false}
                />
              </div>
            )}
        </div>
        <div className={styles['links-wrap']}>
          <div className={styles.links}>
            <div className={styles.link}>
              <MinardLink preview={deployment} commit={commit}>
                <Icon className={styles.icon} name="eye" />
                Open preview
              </MinardLink>
            </div>
            <div className={styles.link}>
              <MinardLink deployment={deployment} openInNewWindow>
                <Icon className={styles.icon} name="arrows-alt" />
                Open raw deployment
              </MinardLink>
            </div>
          </div>
        </div>
        {commentActivities.length > 0 && (
          <div className={styles.comments}>
            <FlipMove enterAnimation="fade" leaveAnimation="fade">
              {commentActivities.map(activity => {
                const comment = {
                  ...activity.comment,
                  deployment: activity.deployment.id,
                  timestamp: activity.timestamp,
                };
                return (
                  <SingleComment key={activity.id} comment={comment} />
                );
              })}
            </FlipMove>
          </div>
        )}
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
