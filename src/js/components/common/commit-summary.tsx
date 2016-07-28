import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import * as Gravatar from 'react-gravatar';

import { Commit } from '../../modules/commits';

import MinardLink from './minard-link';

const styles = require('./commit-summary.scss');

interface Props {
  commit: Commit;
  enableLink?: boolean;
}

const CommitSummary = ({ enableLink, commit }: Props) => {
  const content = (
    <div className="container flex">
      <div className={styles.avatarBox}>
        <figure className="avatar avatar-lg">
          <Gravatar email={commit.author} https />
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
            {commit.author}
          </span>
          <span className={classNames(styles.metadata, 'text-center')}>
            0 comments
          </span>
          <span className={classNames(styles.metadata, 'text-right')}>
            {moment(commit.timestamp).fromNow()}
          </span>
        </div>
      </div>
    </div>
  );

  if (enableLink) {
    return <MinardLink commit={commit}>{content}</MinardLink>;
  }

  return content;
};

export default CommitSummary;
