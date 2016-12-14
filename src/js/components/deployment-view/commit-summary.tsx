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

const CommitSummary = ({ className, commit, deployment, preview }: Props) => {
  // The absolute links don't work in local or test environments
  // TODO: Use MinardLinks once we have users and ACL in place
  const metadata = ['production', 'staging'].indexOf(process.env.ENV) > -1 ? (
    <div className={styles.metadata}>
      <a href={`/project/${preview.project.id}/branch/${preview.branch.id}`}>
        {preview.branch.name}
      </a>
      {' in '}
      <a href={`/project/${preview.project.id}`}>
        {preview.project.name}
      </a>
    </div>
  ) : (
    <div className={styles.metadata}>
      <MinardLink branch={preview.branch.id} project={preview.project.id}>
        {preview.branch.name}
      </MinardLink>
      {' in '}
      <MinardLink project={preview.project.id}>
        {preview.project.name}
      </MinardLink>
    </div>
  );

  return (
    <div className={classNames(styles['commit-summary'], className)}>
      {metadata}
      <div className={styles['commit-message']}>
        {commit.message}
      </div>
      <div className={styles.bottom}>
        <MinardLink className={styles['open-link']} openInNewWindow deployment={deployment}>
          Open in new window
        </MinardLink>
      </div>
    </div>
  );
};

export default CommitSummary;
