import * as classNames from 'classnames';
import * as React from 'react';

import { teamId } from '../../api/team-id';
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
    const { buildLogSelected, className, commit, deployment, highlightComment, preview } = this.props;
    const { dialogOpen } = this.state;

    // This cookie is set in ProjectsFrame.
    // TODO: Remove this once we have proper user authentication in place.
    const authenticatedUser = getValue('teamUser') === `${teamId}`;

    return (
      <div className={classNames(styles.dialog, className)}>
        <Header
          className={styles.header}
          deployment={deployment}
          commit={commit}
          isOpen={dialogOpen}
          onToggleOpen={this.handleToggleOpen}
          buildLogSelected={buildLogSelected}
          authenticatedUser={authenticatedUser}
        />
        {dialogOpen && (
          <CommitSummary
            key="dialog"
            className={styles['commit-summary']}
            commit={commit}
            deployment={deployment}
            preview={preview}
            authenticatedUser={authenticatedUser}
          />
        )}
        {dialogOpen && deployment.comments && !isFetchError(deployment.comments) && deployment.comments.length > 0 && (
          <CommentList
            className={styles['commit-list']}
            commentIds={deployment.comments}
            highlightComment={highlightComment}
            authenticatedUser={authenticatedUser}
          />
        )}
        {dialogOpen && (
          <NewCommentForm
            initialValues={{
              deployment: deployment.id,
              name: getValue('commentName'),
              email: getValue('commentEmail'),
            }}
          />
        )}
      </div>
    );
  }
}

export default PreviewDialog;
