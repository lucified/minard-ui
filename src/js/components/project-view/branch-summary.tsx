import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

import { Branch } from '../../modules/branches';
import Commits, { Commit } from '../../modules/commits';
import Deployments, { Deployment } from '../../modules/deployments';
import { FetchError, isFetchError } from '../../modules/errors';
import { StateTree } from '../../reducers';

import DeploymentScreenshot from '../common/deployment-screenshot';
import MinardLink from '../common/minard-link';
import SingleCommit from '../common/single-commit';
import BuildStatus from './build-status';

const styles = require('./branch-summary.scss');

interface PassedProps {
  branch: Branch | FetchError;
}

interface GeneratedProps {
  latestSuccessfulDeployment?: Deployment | FetchError;
  latestSuccessfullyDeployedCommit?: Commit | FetchError;
  deploymentForLatestCommit?: Deployment | FetchError;
}

const reloadPage = (e: any) => {
  location.reload(true);
  return false;
};

const BranchSummary = (props: PassedProps & GeneratedProps) => {
  const { branch, latestSuccessfulDeployment, latestSuccessfullyDeployedCommit, deploymentForLatestCommit } = props;

  if (isFetchError(branch)) {
    return (
      <div className={classNames('row', styles.branch)}>
        <div className={classNames('col-xs-12', styles.error)}>
          <h3>Unable to load branch</h3>
          <p><a onClick={reloadPage}>Click to reload</a></p>
          <small>{branch.prettyError}</small>
        </div>
      </div>
    );
  }

  let commitContent: JSX.Element;

  if (!latestSuccessfullyDeployedCommit) {
    commitContent = (
      <div className={styles.empty}>
        No previews available
      </div>
    );
  } else {
    if (isFetchError(latestSuccessfulDeployment)) {
      commitContent = (
        <div className={styles.error}>
          <p>Error loading deployment</p>
          <small>{latestSuccessfulDeployment.prettyError}</small>
        </div>
      );
    } else {
      commitContent = (
        <MinardLink openInNewWindow deployment={latestSuccessfulDeployment}>
          <SingleCommit className={styles.hover} commit={latestSuccessfullyDeployedCommit} />
        </MinardLink>
      );
    }
  }

  return (
    <div className={classNames('row', styles.branch)}>
      <div className={classNames('col-xs-2', styles.screenshot)}>
        <MinardLink branch={branch}>
          <DeploymentScreenshot deployment={latestSuccessfulDeployment} />
        </MinardLink>
      </div>
      <div className={classNames('col-xs-10', styles['activity-content'])}>
        <MinardLink branch={branch}>
          <div className={styles.header}>
            <div className={styles.title}>{branch.name}</div>
            <BuildStatus className={styles['build-status']} deployment={deploymentForLatestCommit} />
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

  if (isFetchError(branch)) {
    return {};
  }

  const latestSuccessfullyDeployedCommit = branch.latestSuccessfullyDeployedCommit &&
    Commits.selectors.getCommit(state, branch.latestSuccessfullyDeployedCommit);

  let latestSuccessfulDeployment: FetchError | Deployment | undefined;
  if (latestSuccessfullyDeployedCommit &&
    !isFetchError(latestSuccessfullyDeployedCommit) &&
    latestSuccessfullyDeployedCommit.deployment
  ) {
    latestSuccessfulDeployment =
      Deployments.selectors.getDeployment(state, latestSuccessfullyDeployedCommit.deployment);
  }

  let deploymentForLatestCommit: Deployment | FetchError | undefined;
  if (branch.latestCommit) {
    const latestCommit = branch.latestSuccessfullyDeployedCommit &&
      Commits.selectors.getCommit(state, branch.latestCommit);
    if (latestCommit && !isFetchError(latestCommit) && latestCommit.deployment) {
      deploymentForLatestCommit = branch.latestCommit
        && Deployments.selectors.getDeployment(state, latestCommit.deployment);
    }
  }

  return {
    latestSuccessfulDeployment,
    latestSuccessfullyDeployedCommit,
    deploymentForLatestCommit,
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(BranchSummary);
