import * as classNames from 'classnames';
import * as React from 'react';
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
  latestDeployment?: Deployment | FetchError;
  latestDeployedCommit?: Commit | FetchError;
}

const BranchSummary = ({ branch, latestDeployment, latestDeployedCommit }: PassedProps & GeneratedProps) => {
  let commitContent: JSX.Element;

  if (branch.deployments.length === 0) {
    commitContent = (
      <div className={styles.empty}>
        No previews available
      </div>
    );
  } else {
    if (isError(latestDeployment)) {
      commitContent = (
        <div className={styles.error}>
          Error loading deployment: {latestDeployment.prettyError}
        </div>
      );
    } else {
      commitContent = (
        <MinardLink deployment={latestDeployment}>
          <SingleCommit className={styles.hover} commit={latestDeployedCommit} />
        </MinardLink>
      );
    }
  }

  return (
    <div className={classNames('row', styles.branch)}>
      <div className={classNames('col-xs-2', styles.screenshots)}>
        <MinardLink branch={branch}>
          <ScreenshotPile deployment={latestDeployment} count={branch.deployments.length} />
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
  const latestDeploymentId = branch.deployments[0];
  const latestDeployment = latestDeploymentId && Deployments.selectors.getDeployment(state, latestDeploymentId);
  let latestDeployedCommit: Commit | FetchError | undefined = undefined;

  if (latestDeployment && !isError(latestDeployment)) {
    latestDeployedCommit = Commits.selectors.getCommit(state, latestDeployment.commit);
  }

  return {
    latestDeployment,
    latestDeployedCommit,
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(BranchSummary);
