import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';

import { Branch } from '../../modules/branches';
import Commits, { Commit } from '../../modules/commits';
import Deployments, { Deployment } from '../../modules/deployments';
import { FetchError, isError } from '../../modules/errors';
import { StateTree } from '../../reducers';

import MinardLink from '../common/minard-link';
import ScreenshotPile from '../common/screenshot-pile';
import SingleCommit from '../common/single-commit';

const styles = require('./branch-summary.scss');

interface PassedProps {
  branch: Branch;
}

interface GeneratedProps {
  deployments: (Deployment | FetchError)[];
  latestDeployedCommit?: Commit | FetchError;
}

const BranchSummary = ({ branch, deployments, latestDeployedCommit }: PassedProps & GeneratedProps) => {
  let commitContent: JSX.Element;

  if (branch.deployments.length === 0) {
    commitContent = (
      <div className="card-header">
        <h4 className="card-title">No previews available</h4>
        <h6 className="card-meta">Make some commits to {branch.name} generate previews</h6>
      </div>
    );
  } else {
    const latestDeployment = deployments[0];

    if (isError(latestDeployment)) {
      commitContent = (
        <div className="empty">
          <Icon name="exclamation" fixedWidth size="3x" />
          <p className="empty-title">Error loading deployment</p>
          <p className="empty-meta">{latestDeployment.prettyError}</p>
        </div>
      );
    } else {
      commitContent = (
        <MinardLink deployment={latestDeployment}>
          <SingleCommit commit={latestDeployedCommit} />
        </MinardLink>
      );
    }
  }

  return (
    <div className={classNames('row', styles.branch)}>
      <div className={classNames('col-xs-2', styles.screenshots)}>
        <MinardLink branch={branch}>
          <ScreenshotPile deployments={deployments} />
        </MinardLink>
      </div>
      <div className={classNames('col-xs-10', styles['activity-content'])}>
        <MinardLink branch={branch}>
          <div className={styles.header}>
            <div className={styles.title}>{branch.name}</div>
            {/* TODO: add comments, build status/failure */}
          </div>
          <div className={styles.description}>{branch.description}</div>
        </MinardLink>
        <hr className={styles.line} />
        {commitContent}
      </div>
    </div>
  );
};

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => {
  const { branch } = ownProps;
  const deployments = branch.deployments.map(id => Deployments.selectors.getDeployment(state, id));
  let latestDeployedCommit: Commit | FetchError | undefined = undefined;

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
