import * as classNames from 'classnames';
import * as React from 'react';
import TimeAgo from 'react-timeago';

import { Comment } from '../../modules/comments';

import Avatar from '../common/avatar';

const styles = require('./single-comment.scss');

interface Props {
  comment: Comment | undefined;
  className?: string;
}

const SingleComment = ({ comment, className }: Props) => {
  if (!comment) {
    // Note: this shouldn't happen since we only store comment IDs to deployments
    // once we receive the actual comment.

    // TODO
    return <div>Loading...</div>;
  }

  return (
    <div className={classNames(styles['single-comment'], className)}>
      <div className={styles.avatar}>
        <Avatar email={comment.email} size="40" title={comment.name} />
      </div>
      <div className={styles['comment-content']}>
        <div className={styles.metadata}>
          <span className={styles['author-name']}>
            {comment.name || comment.email}
          </span>
          {` · `}
          <span className={styles.timestamp}>
            <TimeAgo minPeriod={10} date={comment.timestamp} />
          </span>
        </div>
        <div className={styles['comment-message']}>
          {comment.message}
        </div>
      </div>
    </div>
  );
};

export default SingleComment;
