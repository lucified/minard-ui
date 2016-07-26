import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';

import { Branch } from '../../modules/branches';
import commits, { Commit } from '../../modules/commits';
import { StateTree } from '../../reducers';

import CommitSummary from '../commit-summary';
import ScreenshotPile from '../screenshot-pile';

const styles = require('../../../scss/branch-summary.scss');

interface PassedProps {
  branch: Branch;
}

interface GeneratedProps {
  commits: Commit[];
}

const BranchSummary = ({ branch, commits }: PassedProps & GeneratedProps) => (
  <div className="columns">
    <div className="column col-3">
      <ScreenshotPile commits={commits} />
    </div>
    <div className="column col-9">
      <div className={styles.header}>
        <h4 className={styles.title}>{branch.name}</h4>
        <h6 className={styles.description}>{branch.description}</h6>
      </div>
      <div className="card">
        <CommitSummary commit={_.maxBy(commits.filter(commit => commit.hasDeployment), commit => commit.timestamp)} />
      </div>
    </div>
  </div>
);

const mapStateToProps = (state: StateTree, ownProps: PassedProps) => ({
  commits: ownProps.branch.commits.map(commitId => commits.selectors.getCommit(state, commitId)),
});

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(BranchSummary);
