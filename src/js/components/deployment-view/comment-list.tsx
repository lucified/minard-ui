import * as classNames from 'classnames';
import * as React from 'react';
import * as FlipMove from 'react-flip-move';
import { connect } from 'react-redux';

import Comments, { Comment } from '../../modules/comments';
import { StateTree } from '../../reducers';

import SingleComment from '../common/single-comment';

const styles = require('./comment-list.scss');

interface PassedProps {
  commentIds: string[];
  className?: string;
  highlightComment?: string;
  isAuthenticatedUser: boolean;
}

interface GeneratedStateProps {
  comments: (Comment | undefined)[];
}

type Props = PassedProps & GeneratedStateProps;

class CommentList extends React.Component<Props, void> {
  public constructor(props: Props) {
    super(props);

    this.storeListRef = this.storeListRef.bind(this);
  }

  public componentDidMount() {
    const { commentIds, highlightComment } = this.props;

    if (highlightComment && commentIds.indexOf(highlightComment) > -1) {
      this.scrollToElement(
        document.getElementById(this.commentIdString(highlightComment)),
      );
    } else {
      this.scrollToBottom();
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const { comments, highlightComment, commentIds } = this.props;

    if (comments.length > prevProps.comments.length) {
      // Only scroll to bottom if a new comment was added
      this.scrollToBottom();
    } else if (
      highlightComment !== prevProps.highlightComment &&
      highlightComment &&
      commentIds.indexOf(highlightComment) > -1
    ) {
      this.scrollToElement(
        document.getElementById(this.commentIdString(highlightComment)),
      );
    }
  }

  private scrollToElement(element: HTMLElement | null) {
    if (element) {
      this.listRef.scrollTop = element.offsetTop - 50;
    } else {
      console.error('Unable to find highlighted comment element.');
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

  private commentIdString(id: string): string {
    return `comment-${id}`;
  }

  public render() {
    const {
      isAuthenticatedUser,
      commentIds,
      comments,
      className,
      highlightComment,
    } = this.props;

    return (
      <div
        ref={this.storeListRef}
        className={classNames(styles['comment-list'], className)}
      >
        <FlipMove enterAnimation="fade" leaveAnimation="fade">
          {comments.map((comment, i) => {
            const isHighlighted: boolean =
              !!comment && highlightComment === comment.id;
            const idString = this.commentIdString(commentIds[i]);

            return (
              <div
                key={idString}
                id={idString}
                className={classNames(styles.comment, {
                  [styles.highlighted]: isHighlighted,
                })}
              >
                <SingleComment
                  comment={comment}
                  hideDelete={!isAuthenticatedUser}
                />
              </div>
            );
          })}
        </FlipMove>
      </div>
    );
  }
}

const mapStateToProps = (
  state: StateTree,
  ownProps: PassedProps,
): GeneratedStateProps => {
  const { commentIds } = ownProps;

  return {
    comments: commentIds.map(id => Comments.selectors.getComment(state, id)),
  };
};

export default connect<GeneratedStateProps, {}, PassedProps>(mapStateToProps)(
  CommentList,
);
