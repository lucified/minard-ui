import * as React from 'react';

import { Activity, ActivityType } from '../../../modules/activities';

import CommentActivity from './comment-activity';
import DeploymentActivity from './deployment-activity';

interface Props {
  activity: Activity;
  showProjectName?: boolean;
}

const SingleActivity = (props: Props) => {
  const { activity, showProjectName } = props;

  switch (activity.type) {
    case ActivityType.Deployment:
      return (
        <DeploymentActivity activity={activity} showProjectName={showProjectName} />
      );
    case ActivityType.Comment:
      return (
        <CommentActivity activity={activity} showProjectName={showProjectName} />
      );
    default:
      console.log('Error: Unknown activity type!'); // tslint:disable-line:no-console
      return <div />;
  }
};

export default SingleActivity;
