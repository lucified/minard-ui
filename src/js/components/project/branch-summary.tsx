import * as classNames from 'classnames';
import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';

import { Branch } from '../../modules/branches';
import commits, { Commit } from '../../modules/commits';
import { StateTree } from '../../reducers';

import CommitSummary from '../common/commit-summary';
import MinardLink from '../common/minard-link';
import ScreenshotPile from '../common/screenshot-pile';

const styles = require('./branch-summary.scss');

interface PassedProps {
  branch: Branch;
}

interface GeneratedProps {
  commits: Commit[];
  latestDeployedCommit?: Commit;
}

const BranchSummary = ({ branch, commits, latestDeployedCommit }: PassedProps & GeneratedProps) => (
  <div className={classNames('columns', styles.branch)}>
    <div className="column col-3">
      <MinardLink branch={branch}>
        <ScreenshotPile commits={commits} />
      </MinardLink>
    </div>
    <div className="column col-9">
      <MinardLink branch={branch}>
        <div className={styles.header}>
          <h4 className={styles.title}>{branch.name}</h4>
          <h6 className={styles.description}>{branch.description}</h6>
        </div>
      </MinardLink>
      <div className="card">
        {latestDeployedCommit ?
          <CommitSummary commit={latestDeployedCommit} enableLink /> : (
            <div className="card-header">
              <h4 className="card-title">No previews available</h4>
              <h6 className="card-meta">Make some commits to {branch.name} generate previews</h6>
            </div>
          )
        }
      </div>
    </div>
  </div>
);

const mapStateToProps = (state: StateTree, ownProps: PassedProps) => {
  const branchCommits = ownProps.branch.commits.map(commitId => commits.selectors.getCommit(state, commitId));
  const latestDeployedCommit = _.maxBy(
    branchCommits.filter(commit => commit.hasDeployment),
    commit => commit.timestamp
  );

  return {
    commits: branchCommits,
    latestDeployedCommit,
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(BranchSummary);
