import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

import Comments, { Comment } from '../../modules/comments';
import { StateTree } from '../../reducers';

import SingleComment from './single-comment';

const styles = require('./comment-list.scss');

interface PassedProps {
  commentIds: string[];
  className?: string;
}

interface GeneratedStateProps {
  comments: (Comment | undefined)[];
}

type Props = PassedProps & GeneratedStateProps;

const CommentList = ({ comments, className }: Props) => (
  <div className={classNames(styles['comment-list'], className)}>
    {comments.map((comment, i) => <SingleComment key={`comment-${i}`} comment={comment} />)}
  </div>
);

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedStateProps => {
  const { commentIds } = ownProps;

  return {
    comments: commentIds.map(id => Comments.selectors.getComment(state, id)),
  };
};

export default connect(mapStateToProps)(CommentList);
