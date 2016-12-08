import * as React from 'react';

import { logMessage } from '../../../logger';
import { Activity, ActivityType } from '../../../modules/activities';

import CommentActivity from './comment-activity';
import DeploymentActivity from './deployment-activity';

interface Props {
  activity: Activity;
}

const SingleActivity = (props: Props) => {
  const { activity } = props;

  switch (activity.type) {
    case ActivityType.Deployment:
      return (
        <DeploymentActivity activity={activity} />
      );
    case ActivityType.Comment:
      return (
        <CommentActivity activity={activity} />
      );
    default:
      logMessage('Unknown activity type', { activity });

      return <div />;
  }
};

export default SingleActivity;
