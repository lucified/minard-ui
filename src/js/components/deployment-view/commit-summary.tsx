import * as classNames from 'classnames';
import * as React from 'react';
import Icon = require('react-fontawesome');

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
  isAuthenticatedUser: boolean;
}

const CommitSummary = ({ isAuthenticatedUser, className, commit, deployment, preview }: Props) => {
  const metadata = isAuthenticatedUser ? (
    <div className={styles.metadata}>
      <MinardLink branch={preview.branch.id} project={preview.project.id}>
        {preview.branch.name}
      </MinardLink>
      {' in '}
      <MinardLink project={preview.project.id}>
        {preview.project.name}
      </MinardLink>
    </div>
  ) : (
    <div className={styles.metadata}>
      {preview.branch.name} in {preview.project.name}
    </div>
  );

  return (
    <div className={classNames(styles['commit-summary'], className)}>
      {metadata}
      <div className={styles['commit-message']}>
        {commit.message}
        {commit.description && (
          <p>{commit.description}</p>
        )}
      </div>
      <div className={styles.bottom}>
        <MinardLink className={styles['open-link']} openInNewWindow deployment={deployment}>
          <Icon className={styles.icon} name="arrows-alt" />
          Open naked preview
        </MinardLink>
      </div>
    </div>
  );
};

export default CommitSummary;
