import * as classNames from 'classnames';
import * as React from 'react';

import { getValue } from '../../cookie';
import { Commit } from '../../modules/commits';
import { Deployment } from '../../modules/deployments';
import { isFetchError } from '../../modules/errors';
import { Preview } from '../../modules/previews';

import CommentList from './comment-list';
import CommitSummary from './commit-summary';
import Header from './header';
import NewCommentForm from './new-comment-form';

const styles = require('./preview-dialog.scss');

interface Props {
  buildLogSelected: boolean;
  commit: Commit;
  deployment: Deployment;
  preview: Preview;
  isAuthenticatedUser: boolean;
  userEmail?: string;
  highlightComment?: string;
  className?: string;
}

interface State {
  dialogOpen: boolean;
}

class PreviewDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.handleToggleOpen = this.handleToggleOpen.bind(this);

    this.state = {
      dialogOpen: !!props.highlightComment,
    };
  }

  private handleToggleOpen(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      dialogOpen: !this.state.dialogOpen,
    });
  }

  public render() {
    const {
      buildLogSelected,
      className,
      commit,
      deployment,
      highlightComment,
      preview,
      isAuthenticatedUser,
      userEmail,
    } = this.props;
    const { dialogOpen } = this.state;

    return (
      <div className={classNames(styles.dialog, className)}>
        <Header
          className={styles.header}
          deployment={deployment}
          isOpen={dialogOpen}
          onToggleOpen={this.handleToggleOpen}
          buildLogSelected={buildLogSelected}
          isAuthenticatedUser={isAuthenticatedUser}
        />
        {dialogOpen && (
          <CommitSummary
            key="dialog"
            className={styles['commit-summary']}
            commit={commit}
            deployment={deployment}
            preview={preview}
            isAuthenticatedUser={isAuthenticatedUser}
          />
        )}
        {dialogOpen && deployment.comments && !isFetchError(deployment.comments) && deployment.comments.length > 0 && (
          <CommentList
            className={styles['commit-list']}
            commentIds={deployment.comments}
            highlightComment={highlightComment}
            isAuthenticatedUser={isAuthenticatedUser}
          />
        )}
        {dialogOpen && (
          <NewCommentForm
            isAuthenticatedUser={isAuthenticatedUser}
            initialValues={{
              deployment: deployment.id,
              name: getValue('commentName'),
              email: userEmail || getValue('commentEmail'),
            }}
          />
        )}
      </div>
    );
  }
}

export default PreviewDialog;
