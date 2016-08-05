import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';

import { Branch } from '../../modules/branches';
import Commits, { Commit } from '../../modules/commits';
import Deployments, { Deployment } from '../../modules/deployments';
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

const BranchSummary = ({ branch, deployments, latestDeployedCommit }: PassedProps & GeneratedProps) => {
  let cardContent = (
    <div className="card-header">
      <h4 className="card-title">No previews available</h4>
      <h6 className="card-meta">Make some commits to {branch.name} generate previews</h6>
    </div>
  );

  if (branch.deployments.length > 0) {
    if (latestDeployedCommit) {
      cardContent = <CommitSummary commit={latestDeployedCommit} deployment={deployments[0]} />;
    } else {
      cardContent = (
        <div className="empty">
          <Icon name="circle-o-notch" spin fixedWidth size="3x" />
          <p className="empty-title">Loading deployment</p>
          <p className="empty-meta">Hold on a sec…</p>
        </div>
      );
    }
  }

  return (
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
          {cardContent}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: StateTree, ownProps: PassedProps) => {
  const { branch } = ownProps;
  const deployments = branch.deployments.map(id => Deployments.selectors.getDeployment(state, id));
  let latestDeployedCommit: Commit = undefined;

  if (deployments.length > 0 && deployments[0]) {
    latestDeployedCommit = Commits.selectors.getCommit(state, deployments[0].commit);
  }

  return {
    deployments,
    latestDeployedCommit,
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(BranchSummary);
