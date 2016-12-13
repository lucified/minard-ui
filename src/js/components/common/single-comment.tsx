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
import SimpleConfirmable from '../common/simple-confirmable';

const styles = require('./single-comment.scss');

interface PassedProps {
  comment?: Comment;
  hideDelete?: boolean;
  className?: string;
}

interface GeneratedStateProps {
  deletionInProgress: boolean;
}

interface GeneratedDispatchProps {
  deleteComment: () => void;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps;

const SingleComment = ({ comment, className, deletionInProgress, deleteComment, hideDelete }: Props) => {
  if (!comment) {
    // Note: this shouldn't happen since we only store comment IDs to deployments
    // once we receive the actual comment.

    // TODO: Make this nicer
    return <div>Loading...</div>;
  }

  const { name, email, message, timestamp } = comment;

  return (
    <div className={classNames(styles['single-comment'], className)}>
      <div className={styles.avatar}>
        <Avatar email={email} size="40" title={name} />
      </div>
      <div className={styles['comment-content']}>
        <div className={styles.actions}>
          {!hideDelete && (
            deletionInProgress ? 'Deleting...' : (
              <SimpleConfirmable
                action="Delete"
                onConfirm={deleteComment}
              >
                <a className={styles.delete}>
                  Delete
                </a>
              </SimpleConfirmable>
            )
          )}
        </div>
        <div className={styles.metadata}>
          <span className={styles['author-name']}>
            {name || email}
          </span>
          {` · `}
          <span className={styles.timestamp}>
            <TimeAgo minPeriod={10} date={timestamp} />
          </span>
        </div>
        <div className={styles['comment-message']}>
          {message}
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
