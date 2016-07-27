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
  latestDeployedCommit?: Commit;
}

const BranchSummary = ({ branch, commits, project, latestDeployedCommit }: PassedProps & GeneratedProps) => (
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
        {latestDeployedCommit ?
          <CommitSummary commit={latestDeployedCommit} /> : (
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
    latestDeployedCommit
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(BranchSummary);
