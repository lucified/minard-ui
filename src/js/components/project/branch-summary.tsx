import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

import { Branch } from '../../modules/branches';
import commits, { Commit } from '../../modules/commits';
import deployments, { Deployment } from '../../modules/deployments';
import { StateTree } from '../../reducers';

import CommitSummary from '../common/commit-summary';
import MinardLink from '../common/minard-link';
import ScreenshotPile from '../common/screenshot-pile';

const styles = require('./branch-summary.scss');

interface PassedProps {
  branch: Branch;
}

interface GeneratedProps {
  deployments: Deployment[];
  latestDeployedCommit?: Commit;
}

const BranchSummary = ({ branch, deployments, latestDeployedCommit }: PassedProps & GeneratedProps) => (
  <div className={classNames('columns', styles.branch)}>
    <div className="column col-3">
      <MinardLink branch={branch}>
        <ScreenshotPile deployments={deployments} />
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
        {deployments.length > 0 ?
          <CommitSummary commit={latestDeployedCommit} deployment={deployments[0]} /> : (
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
  const { branch } = ownProps;
  const branchDeployments = branch.deployments.map(id => deployments.selectors.getDeployment(state, id));
  let latestDeployedCommit: Commit = undefined;

  if (branchDeployments.length > 0) {
    latestDeployedCommit = commits.selectors.getCommit(state, branchDeployments[0].commit);
  }

  return {
    deployments: branchDeployments,
    latestDeployedCommit,
  }
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(BranchSummary);
