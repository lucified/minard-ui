import * as moment from 'moment';
import * as React from 'react';

import { Commit } from '../../modules/commits';
import { FetchError, isError } from '../../modules/errors';

import Avatar from './avatar';

const styles = require('./single-commit.scss');

interface Props {
  commit: Commit | FetchError;
}

const SingleCommit = ({ commit }: Props) => {
  if (!commit) {
    return <span>'Loading...'</span>;
  }

  if (isError(commit)) {
    return <span>`Error: ${commit.prettyError}`</span>;
  }

  const { author, committer } = commit;
  const otherAuthorEmail = author.email !== committer.email ? committer.email : undefined;

  return (
    <div className={styles['commit-content']}>
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
          <div className={styles.message}>{commit.message}</div>
          {commit.description && <div className={styles.description}>{commit.description}</div>}
        </div>
      </div>
    </div>
  );
};

export default SingleCommit;
