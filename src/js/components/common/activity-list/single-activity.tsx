import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import * as Gravatar from 'react-gravatar';

import { Activity, ActivityType } from '../../../modules/activities';
import { Branch } from '../../../modules/branches';
import { Commit } from '../../../modules/commits';
import { Deployment } from '../../../modules/deployments';
import { FetchError, isError } from '../../../modules/errors';
import { Project } from '../../../modules/projects';

import MinardLink from '../minard-link';

const styles = require('./single-activity.scss');

interface Props {
  activity: Activity;
  branch: Branch;
  showProjectName: boolean;
  deployment: Deployment;
  project: Project | FetchError;
  commit?: Commit | FetchError;
}

const getAction = (activity: Activity): string => {
  switch (activity.type) {
    case ActivityType.Comment:
      return 'commented on';
    case ActivityType.Deployment:
      return 'generated preview';
    default:
      return 'did an unknown action';
  }
};

const getIcon = (activity: Activity): JSX.Element => {
  switch (activity.type) {
    case ActivityType.Comment:
      return <Icon className={styles['preview-icon']} name="comment-o" />;
    case ActivityType.Deployment:
      return <Icon className={styles['preview-icon']} name="eye" />;
    default:
      return <Icon className={styles['preview-icon']} name="question" />;
  }
};

const getActivityMetadata = (activity: Activity, activityContent: Commit | FetchError | undefined): JSX.Element => {
  if (!activityContent || isError(activityContent)) {
    return null;
  }

  const { author } = activityContent;

  switch (activity.type) {
    case ActivityType.Comment:
      // TODO once we add comments
      return (
        <span>
          <span className={styles.author}>{author.name || author.email}</span>
          {' · '}
          <span className={styles.timestamp}>{moment(author.timestamp).fromNow()}</span>
        </span>
      );
    case ActivityType.Deployment:
      return (
        <span>
          <span className={styles.author}>{author.name || author.email}</span>
          {' · '}
          <span className={styles.timestamp}>{moment(author.timestamp).fromNow()}</span>
          {' · '}
          <span className={styles.hash}>{activityContent.hash.slice(0, 8)}</span>
        </span>
      );
    default:
      return null;
  }
};

const getActivityBody = (activity: Activity, activityContent: Commit | FetchError | undefined): JSX.Element => {
  if (!activityContent) {
    return <span>'Loading...'</span>;
  }

  if (isError(activityContent)) {
    return <span>`Error: ${activityContent.prettyError}`</span>;
  }

  switch (activity.type) {
    case ActivityType.Comment:
      return null; // TODO
    case ActivityType.Deployment:
      const commit = activityContent as Commit;
      return <span className={styles.commit}>{commit.message}</span>;
    default:
      return null;
  }
};

const getAuthor = (activity: Activity, activityContent: Deployment): string => {
  switch (activity.type) {
    case ActivityType.Comment:
      return ''; // TODO
    case ActivityType.Deployment:
      return activityContent.creator.name || activityContent.creator.email;
    default:
      return 'Unknown activity type';
  }
};

const getBranchAction = (activity: Activity, branch: Branch, deployment: Deployment) => {
  return (
    <span>
      <span className={styles['deployment-metadata-author']}>
        {getAuthor(activity, deployment)}
      </span>
      {` ${getAction(activity)} `}
      <MinardLink className={styles['deployment-metadata-deployment']} deployment={deployment} openInNewWindow>
        {activity.deployment}
      </MinardLink>
      {' in '}
      <MinardLink className={styles['deployment-metadata-branch']} branch={branch}>
        {branch.name}
      </MinardLink>
    </span>
  );
};

const getProjectLabel = (project: Project) => {
  return (
    <span>
      {' in '}
      <MinardLink className={styles['deployment-metadata-project']} project={project}>
        {project.name}
      </MinardLink>
    </span>
  );
};

const SingleActivity = (props: Props) => {
  const { activity, branch, commit, deployment, showProjectName, project } = props;
  const { creator } = deployment;

  return (
    <div className={styles.activity}>
      <div className={styles['deployment-metadata']}>
        <div className={styles.action}>
          {getIcon(activity)}
          {getBranchAction(activity, branch, deployment)}
          {showProjectName && project && !isError(project) && getProjectLabel(project)}
        </div>
        <div className={styles.share}>
          Share
        </div>
      </div>
      <div className={styles['activity-content']}>
        <div className={styles.avatar}>
          <figure title={creator.name || creator.email} className={classNames(styles['avatar-40'], 'avatar')}>
            <Gravatar size={80} rating="pg" email={creator.email} https />
          </figure>
        </div>
        <div>
          <div className={styles['activity-metadata']}>
            {getActivityMetadata(activity, commit)}
          </div>
          <div className={styles['activity-body']}>
            {getActivityBody(activity, commit)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleActivity;
