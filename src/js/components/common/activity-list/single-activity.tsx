import * as moment from 'moment';
import * as React from 'react';
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

const getActivityBody = (activity: Activity, activityContent: Commit | FetchError | undefined): string => {
  if (!activityContent) {
    return 'Loading...';
  }

  if (isError(activityContent)) {
    return `Error: ${activityContent.prettyError}`;
  }

  switch (activity.type) {
    case ActivityType.Comment:
      return ''; // TODO
    case ActivityType.Deployment:
      const commit = activityContent as Commit;
      return commit.message;
    default:
      return 'Unknown activity type';
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
      {`${getAuthor(activity, deployment)} ${getAction(activity)} `}
      <MinardLink deployment={deployment}>{activity.deployment}</MinardLink>
      {' in '}
      <MinardLink branch={branch}>{branch.name}</MinardLink>
    </span>
  );
};

const getProjectLabel = (project: Project) => {
  return (
    <span> in <MinardLink project={project}>{project.name}</MinardLink></span>
  );
};

const SingleActivity = (props: Props) => {
  const { activity, branch, commit, deployment, showProjectName, project } = props;
  const { creator } = deployment;

  return (
    <div className={styles.activity}>
      <div className={styles.metadata}>
        <div className={styles.action}>
          {getBranchAction(activity, branch, deployment)}
          {showProjectName && project && !isError(project) && getProjectLabel(project)}
        </div>
        <div className={styles.timestamp}>
          {moment(activity.timestamp).fromNow()}
        </div>
      </div>
      <div className="columns">
        <div className="column col-1">
          <figure title={creator.name || creator.email} className="avatar avatar-lg">
            <Gravatar rating="pg" email={creator.email} https />
          </figure>
        </div>
        <div className="column col-11">
          {getActivityBody(activity, commit)}
        </div>
      </div>
    </div>
  );
};

export default SingleActivity;
