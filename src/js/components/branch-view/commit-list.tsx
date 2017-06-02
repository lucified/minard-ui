import * as classNames from 'classnames';
import * as React from 'react';
import * as FlipMove from 'react-flip-move';
import Icon = require('react-fontawesome');
import * as Waypoint from 'react-waypoint';

import { Commit } from '../../modules/commits';
import { FetchError, isFetchError } from '../../modules/errors';

import LoadingIcon from '../common/loading-icon';
import CommitRow from './commit-row';

const styles = require('./commit-list.scss');

const getEmptyContent = () =>
  <div className={styles.empty}>
    <Icon name="code-fork" fixedWidth size="3x" />
    <h2>No activity in this branch</h2>
    <p>Commit some code to get things started.</p>
  </div>;

interface Props {
  commits: (Commit | FetchError | undefined)[];
  isLoading: boolean;
  allLoaded: boolean;
  loadCommits: (count: number, until?: number) => void;
}

const CommitList = ({ commits, isLoading, allLoaded, loadCommits }: Props) => {
  if (commits.length === 0) {
    return (
      <section className={classNames(styles['commit-list'], 'container-fluid')}>
        {getEmptyContent()}
      </section>
    );
  }

  const lastCommit = commits[commits.length - 1];

  return (
    <section className={classNames(styles['commit-list'], 'container-fluid')}>
      <FlipMove enterAnimation="fade" leaveAnimation="fade">
        {commits.map((commit, i) =>
          <CommitRow
            key={(commit && commit.id) || i}
            commit={isFetchError(commit) ? undefined : commit}
          />,
        )}
      </FlipMove>
      {isLoading && <LoadingIcon className={styles.loading} center />}
      {!isLoading &&
        !allLoaded &&
        lastCommit &&
        !isFetchError(lastCommit) &&
        <Waypoint
          bottomOffset="-200px" // Start loading new commits when the waypoint is 200px below the bottom edge
          onEnter={() => {
            loadCommits(
              10,
              lastCommit.committer.timestamp,
            ); /* tslint:disable-line:jsx-no-lambda */
          }}
        />}
      {allLoaded &&
        <div className="row center-xs">
          <div className={classNames('col-xs-12', styles.end)}>
            <h2>Beginning of branch</h2>
          </div>
        </div>}
    </section>
  );
};

export default CommitList;
