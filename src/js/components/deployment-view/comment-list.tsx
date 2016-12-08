import * as classNames from 'classnames';
import * as React from 'react';
import * as FlipMove from 'react-flip-move';
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

  public componentDidUpdate(prevProps: Props) {
    if (this.props.comments.length > prevProps.comments.length) {
      // We don't want to scroll to the bottom if e.g. deleting an old comment.
      // This method (only scrolling if the comments list is longer) is not
      // foolproof, but should cover most cases.
      this.scrollToBottom();
    }
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
        <FlipMove enterAnimation="elevator" leaveAnimation="elevator">
          {comments.map((comment, i) => <SingleComment key={`comment-${commentIds[i]}`} comment={comment} />)}
        </FlipMove>
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
