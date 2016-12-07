import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import { Dispatch } from 'redux';

import { logMessage } from '../../logger';
import Comments, { Comment } from '../../modules/comments';
import Requests from '../../modules/requests';
import { StateTree } from '../../reducers';

import Avatar from '../common/avatar';
import Confirmable from '../common/confirmable';

const styles = require('./single-comment.scss');

interface PassedProps {
  comment: Comment | undefined;
  className?: string;
}

interface GeneratedStateProps {
  deletionInProgress: boolean;
}

interface GeneratedDispatchProps {
  deleteComment: () => void;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps;

const SingleComment = ({ comment, className, deletionInProgress, deleteComment }: Props) => {
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
        <div className={styles.actions}>
          {deletionInProgress ? 'Deleting...' : (
            <Confirmable
              title="Warning!"
              message={
                'Deleting a comment cannot be undone. ' +
                'Are you sure you want to delete this comment for everyone?'
              }
              action="Delete comment"
              onConfirm={deleteComment}
            >
              <a className={styles.delete}>
                Delete
              </a>
            </Confirmable>
          )}
        </div>
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

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedStateProps => {
  const { comment } = ownProps;

  return {
    deletionInProgress: !!comment && Requests.selectors.isDeletingComment(state, comment.id),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>, passedProps: PassedProps): GeneratedDispatchProps => ({
  deleteComment: () => {
    if (!passedProps.comment) {
      logMessage('Trying to delete a comment that doesn\'t exist!', { props: passedProps });
      return;
    }

    dispatch(Comments.actions.deleteComment(passedProps.comment.id));
  },
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SingleComment);
