import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';

import { Commit } from '../../modules/commits';
import { Deployment } from '../../modules/deployments';
import { FetchError, isFetchError } from '../../modules/errors';

import Avatar from './avatar';
import BuildStatus from './build-status';
import PlaceholderCommit from './placeholder-commit';

const styles = require('./single-commit.scss');

interface Props {
  commit?: Commit | FetchError;
  className?: string;
  deployment?: Deployment | FetchError;
}

const SingleCommit = ({ commit, className, deployment }: Props) => {
  if (!commit) {
    return <PlaceholderCommit className={classNames(className)} />;
  }

  if (isFetchError(commit)) {
    return (
      <div className={styles.error}>
        <p>Unable to load commit. Refresh to retry.</p>
        <small>{commit.prettyError}</small>
      </div>
    );
  }

  const { author, committer } = commit;
  const otherAuthorEmail = author.email !== committer.email ? committer.email : undefined;

  const buildStatus = deployment && !isFetchError(deployment) ?
    <BuildStatus deployment={deployment} className={styles['build-status']} latest={false} /> : undefined;

  return (
    <div className={classNames(styles['commit-content'], className)}>
      <div className={styles.avatar}>
        <Avatar title={author.name || author.email} size="40" email={author.email} iconEmail={otherAuthorEmail} />
      </div>
      <div>
        <div className={styles['commit-metadata']}>
          <span>
            <span className={styles.author}>{author.name || author.email}</span>
            {' · '}
            <span className={styles.timestamp}>{moment(author.timestamp).fromNow()}</span>
            {' · '}
            <span className={styles.hash}>{commit.hash.slice(0, 8)}</span>
          </span>
        </div>
        <div className={styles['commit-body']}>
          <div className={classNames(styles.message, 'commit-message')}>{commit.message}</div>
          {commit.description && <div className={styles.description}>{commit.description}</div>}
        </div>
      </div>
      <div className={styles['build-status-outer']}>
        {buildStatus}
      </div>
    </div>
  );
};

export default SingleCommit;
