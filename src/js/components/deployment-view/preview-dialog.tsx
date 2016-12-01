import * as classNames from 'classnames';
import * as React from 'react';

import { Commit } from '../../modules/commits';
import { Deployment } from '../../modules/deployments';
import { Preview } from '../../modules/previews';

import CommitSummary from './commit-summary';
import Header from './header';

const styles = require('./preview-dialog.scss');

interface Props {
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
      dialogOpen: true,
    };
  }

  private toggleOpen(_e: any) {
    this.setState({
      dialogOpen: !this.state.dialogOpen,
    });

    return false;
  }

  public render() {
    const { className, commit, deployment, preview } = this.props;
    const { dialogOpen } = this.state;

    return (
      <div className={classNames(styles.dialog, className)}>
        <Header className={styles.header} isOpen={dialogOpen} onToggleOpen={this.toggleOpen} />
        {dialogOpen && (
          <CommitSummary
            key="dialog"
            className={styles['commit-summary']}
            commit={commit}
            deployment={deployment}
            preview={preview}
          />
        )}
      </div>
    );
  }
}

export default PreviewDialog;
