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

class CommentList extends React.Component<Props, any> {
  public constructor(props: Props) {
    super(props);

    this.storeListRef = this.storeListRef.bind(this);
  }

  public componentDidMount() {
    this.scrollToBottom();
  }

  public componentDidUpdate() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    // Scroll to bottom of div
    this.listRef.scrollTop = this.listRef.scrollHeight;
  }

  private listRef: HTMLElement;

  private storeListRef(ref: HTMLElement) {
    this.listRef = ref;
  }

  public render() {
    const { commentIds, comments, className } = this.props;
    return (
      <div ref={this.storeListRef} className={classNames(styles['comment-list'], className)}>
        {comments.map((comment, i) => <SingleComment key={`comment-${commentIds[i]}`} comment={comment} />)}
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedStateProps => {
  const { commentIds } = ownProps;

  return {
    comments: commentIds.map(id => Comments.selectors.getComment(state, id)),
  };
};

export default connect(mapStateToProps)(CommentList);
