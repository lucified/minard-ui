import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';

import { Commit } from '../modules/commits';

const styles = require('../../scss/commit-summary.scss');
const avatar = require('../../images/avatar.png');

interface Props {
  commit: Commit;
}

const CommitSummary = ({commit}: Props) => (
  <div className="container">
    <div className="columns">
      <div className="column col-1">
        <figure className="avatar avatar-lg">
          <img src={avatar} />
        </figure>
      </div>
      <div className="column col-11">
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
  </div>
);

export default CommitSummary;
