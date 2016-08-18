import * as React from 'react';

import { Activity, ActivityType } from '../../../modules/activities';
import { Branch } from '../../../modules/branches';
import { Commit } from '../../../modules/commits';
import { Deployment } from '../../../modules/deployments';
import { FetchError } from '../../../modules/errors';
import { Project } from '../../../modules/projects';

import CommentActivity from './comment-activity';
import DeploymentActivity from './deployment-activity';

interface Props {
  activity: Activity;
  branch: Branch;
  showProjectName: boolean;
  deployment: Deployment;
  project: Project | FetchError;
  commit?: Commit | FetchError;
  comment?: any;
}

const SingleActivity = (props: Props) => {
  const { activity, branch, showProjectName, deployment, project, commit, comment } = props;

  switch (activity.type) {
    case ActivityType.Deployment:
      return (
        <DeploymentActivity
          activity={activity}
          branch={branch}
          showProjectName={showProjectName}
          deployment={deployment}
          project={project}
          commit={commit}
        />
      );
    case ActivityType.Comment:
      return (
        <CommentActivity
          activity={activity}
          branch={branch}
          showProjectName={showProjectName}
          deployment={deployment}
          project={project}
          comment={comment}
        />
      );
    default:
      console.log('Error: Unknown activity type!');
      return null;
  }
};

export default SingleActivity;
