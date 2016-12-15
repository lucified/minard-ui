import * as React from 'react';

import { Activity } from '../../../modules/activities';

import MinardLink from '../minard-link';
import SingleComment from '../single-comment';

interface Props {
  activity: Activity;
}

const CommentActivity = ({ activity }: Props) => {
  const comment = {
    ...activity.comment,
    deployment: activity.deployment.id,
    timestamp: activity.timestamp,
  };

  return (
    <MinardLink comment={comment} commit={activity.commit}>
      <SingleComment comment={comment} hideDelete />
    </MinardLink>
  );
};

export default CommentActivity;
