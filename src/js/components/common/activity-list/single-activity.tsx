import * as Raven from 'raven-js';
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
      console.error('Unknown activity type', activity);

      if (Raven.isSetup()) {
        Raven.captureMessage('Unknown activity type', { extra: activity });
      }

      return <div />;
  }
};

export default SingleActivity;
