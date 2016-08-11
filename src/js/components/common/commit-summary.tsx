import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import * as Gravatar from 'react-gravatar';

import { Commit } from '../../modules/commits';
import { Deployment } from '../../modules/deployments';
import { FetchError, isError } from '../../modules/errors';

import MinardLink from './minard-link';

const styles = require('./commit-summary.scss');

interface Props {
  commit: Commit | FetchError;
  deployment?: Deployment | FetchError;
}

const CommitSummary = ({ commit, deployment }: Props) => {
  if (isError(commit)) {
    return (
      <div>
        <h3>Oh no. Something went wrong.</h3>
        <p>{commit.prettyError}</p>
      </div>
    );
  }

  const { author, commiter } = commit;

  const content = (
    <div className="container flex">
      <div className={styles.avatarBox}>
        <figure title={author.name || author.email} className="avatar avatar-lg">
          <Gravatar rating="pg" email={author.email} https />
          {commiter.email !== author.email &&
            <Gravatar rating="pg" email={commiter.email} className="avatar-icon" https />
          }
        </figure>
      </div>
      <div className={styles.commitContent}>
        <div className="flex">
          <div className={styles.header}>
            <p className={styles.title}>{commit.message}</p>
            {commit.description && <p className={styles.description}>{commit.description}</p>}
          </div>
          <div className={styles.hash}>
            {commit.hash.substring(0, 8)}
          </div>
        </div>
        <div className="flex">
          <span className={classNames(styles.metadata, 'text-left')}>
            {author.name || author.email}
          </span>
          <span className={classNames(styles.metadata, 'text-center')}>
            0 comments
          </span>
          <span className={classNames(styles.metadata, 'text-right')}>
            {moment(author.timestamp).fromNow()}
          </span>
        </div>
      </div>
    </div>
  );

  if (deployment && !isError(deployment)) {
    return <MinardLink deployment={deployment}>{content}</MinardLink>;
  }

  return content;
};

export default CommitSummary;
