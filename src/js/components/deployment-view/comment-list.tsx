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

  private commentIdString(id: string): string {
    return `comment-${id}`;
  }

  public render() {
    const { commentIds, comments, className, highlightComment } = this.props;

    return (
      <div ref={this.storeListRef} className={classNames(styles['comment-list'], className)}>
        <FlipMove enterAnimation="fade" leaveAnimation="fade">
          {comments.map((comment, i) => {
            const isHighlighted: boolean = !!comment && highlightComment === comment.id;
            const idString = this.commentIdString(commentIds[i]);

            return (
              <div
                key={idString}
                id={idString}
                className={classNames(
                  styles.comment,
                  { [styles.highlighted]: isHighlighted },
                )}
              >
                <SingleComment comment={comment} />
              </div>
            );
          })}
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
