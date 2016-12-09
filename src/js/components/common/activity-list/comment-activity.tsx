import * as React from 'react';

import { Activity } from '../../../modules/activities';

import MinardLink from '../minard-link';
import SingleComment from '../single-comment';

interface Props {
  activity: Activity;
}

const CommentActivity = ({ activity }: Props) => (
  <MinardLink preview={activity.deployment}>
    <SingleComment
      comment={{
        ...activity.comment,
        deployment: activity.deployment.id,
        timestamp: activity.timestamp,
      }}
      hideDelete
    />
  </MinardLink>
);

export default CommentActivity;
