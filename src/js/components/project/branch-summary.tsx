import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Branch } from '../../modules/branches';
import commits, { Commit } from '../../modules/commits';
import { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import CommitSummary from '../common/commit-summary';
import ScreenshotPile from '../common/screenshot-pile';

const styles = require('../../../scss/branch-summary.scss');

interface PassedProps {
  branch: Branch;
  project: Project;
}

interface GeneratedProps {
  commits: Commit[];
}

const BranchSummary = ({ branch, commits, project }: PassedProps & GeneratedProps) => (
  <div className="columns">
    <div className="column col-3">
      <Link to={`/project/${project.id}/${branch.name}`}>
        <ScreenshotPile commits={commits} />
      </Link>
    </div>
    <div className="column col-9">
      <Link to={`/project/${project.id}/${branch.name}`}>
        <div className={styles.header}>
          <h4 className={styles.title}>{branch.name}</h4>
          <h6 className={styles.description}>{branch.description}</h6>
        </div>
      </Link>
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
