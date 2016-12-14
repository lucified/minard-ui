import * as classNames from 'classnames';
import * as React from 'react';

import { Commit } from '../../modules/commits';
import { Deployment } from '../../modules/deployments';
import { Preview } from '../../modules/previews';

import MinardLink from '../common/minard-link';

const styles = require('./commit-summary.scss');

interface Props {
  className?: string;
  commit: Commit;
  deployment: Deployment;
  preview: Preview;
}

const CommitSummary = ({ className, commit, deployment, preview }: Props) => (
  <div className={classNames(styles['commit-summary'], className)}>
    <div className={styles.metadata}>
      <MinardLink branch={preview.branch.id} project={preview.project.id}>
        {preview.branch.name}
      </MinardLink>
      {' in '}
      <MinardLink project={preview.project.id}>
        {preview.project.name}
      </MinardLink>
    </div>
    <div className={styles['commit-message']}>
      {commit.message}
    </div>
    <div className={styles.bottom}>
      <MinardLink className={styles['open-link']} preview={deployment}>
        Open in new window
      </MinardLink>
    </div>
  </div>
);

export default CommitSummary;
