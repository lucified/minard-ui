import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';

import { Branch } from '../../modules/branches';
import Commits, { Commit } from '../../modules/commits';
import Deployments, { Deployment } from '../../modules/deployments';
import { FetchError, isError } from '../../modules/errors';
import { StateTree } from '../../reducers';

import CommitSummary from '../common/commit-summary';
import MinardLink from '../common/minard-link';
import ScreenshotPile from '../common/screenshot-pile';

const styles = require('./branch-summary.scss');

interface PassedProps {
  branch: Branch;
}

interface GeneratedProps {
  deployments: (Deployment | FetchError)[];
  latestDeployedCommit?: Commit | FetchError;
}

const BranchSummary = ({ branch, deployments, latestDeployedCommit }: PassedProps & GeneratedProps) => {
  let cardContent: JSX.Element;

  if (branch.deployments.length > 0) {
    const latestDeployment = deployments[0];

    if (latestDeployedCommit) {
      cardContent = <CommitSummary commit={latestDeployedCommit} deployment={latestDeployment} />;
    } else if (!latestDeployment) {
      cardContent = (
        <div className="empty">
          <Icon name="circle-o-notch" spin fixedWidth size="3x" />
          <p className="empty-title">Loading deployment</p>
          <p className="empty-meta">Hold on a sec…</p>
        </div>
      );
    } else if (isError(latestDeployment)) {
      cardContent = (
        <div className="empty">
          <Icon name="exclamation" fixedWidth size="3x" />
          <p className="empty-title">Error loading deployment</p>
          <p className="empty-meta">{latestDeployment.error}</p>
        </div>
      );
    } else {
      console.log('Branch summary: You shouldn\'t be here');
    }
  } else {
    cardContent = (
      <div className="card-header">
        <h4 className="card-title">No previews available</h4>
        <h6 className="card-meta">Make some commits to {branch.name} generate previews</h6>
      </div>
    );
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
};

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => {
  const { branch } = ownProps;
  const deployments = branch.deployments.map(id => Deployments.selectors.getDeployment(state, id));
  let latestDeployedCommit: Commit | FetchError = undefined;

  if (deployments.length > 0) {
    const latestDeployment = deployments[0];
    if (latestDeployment && !isError(latestDeployment)) {
      latestDeployedCommit = Commits.selectors.getCommit(state, latestDeployment.commit);
    }
  }

  return {
    deployments,
    latestDeployedCommit,
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(BranchSummary);
