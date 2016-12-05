import * as classNames from 'classnames';
import * as React from 'react';

import { Commit } from '../../modules/commits';
import { Deployment } from '../../modules/deployments';
import { isFetchError } from '../../modules/errors';
import { Preview } from '../../modules/previews';

import CommitSummary from './commit-summary';
import Header from './header';

const styles = require('./preview-dialog.scss');

interface Props {
  buildLogSelected: boolean;
  commit: Commit;
  deployment: Deployment;
  preview: Preview;
  className?: string;
}

interface State {
  dialogOpen: boolean;
}

class PreviewDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.toggleOpen = this.toggleOpen.bind(this);

    this.state = {
      dialogOpen: false,
    };
  }

  private toggleOpen(_e: any) {
    this.setState({
      dialogOpen: !this.state.dialogOpen,
    });

    return false;
  }

  public render() {
    const { buildLogSelected, className, commit, deployment, preview } = this.props;
    const { dialogOpen } = this.state;

    return (
      <div className={classNames(styles.dialog, className)}>
        <Header
          className={styles.header}
          deployment={deployment}
          isOpen={dialogOpen}
          onToggleOpen={this.toggleOpen}
          buildLogSelected={buildLogSelected}
        />
        {dialogOpen && (
          <CommitSummary
            key="dialog"
            className={styles['commit-summary']}
            commit={commit}
            deployment={deployment}
            preview={preview}
          />
        )}
        {!isFetchError(deployment.comments) && deployment.comments.length > 0 && (
          <span>Comments: {deployment.comments.length}</span>
        )}
      </div>
    );
  }
}

export default PreviewDialog;