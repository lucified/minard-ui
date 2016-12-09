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
      name={activity.name}
      email={activity.email}
      message={activity.message}
      timestamp={activity.timestamp}
    />
  </MinardLink>
);

export default CommentActivity;
