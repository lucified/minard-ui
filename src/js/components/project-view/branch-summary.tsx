import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

import { Branch } from '../../modules/branches';
import Commits, { Commit } from '../../modules/commits';
import Deployments, { Deployment } from '../../modules/deployments';
import { FetchError, isFetchError } from '../../modules/errors';
import { StateTree } from '../../reducers';

import BuildStatus from '../common/build-status';
import DeploymentScreenshot from '../common/deployment-screenshot';
import MinardLink from '../common/minard-link';
import SingleCommit from '../common/single-commit';

const styles = require('./branch-summary.scss');

interface PassedProps {
  branch: Branch;
}

interface GeneratedProps {
  latestSuccessfulDeployment?: Deployment | FetchError;
  latestSuccessfullyDeployedCommit?: Commit | FetchError;
  deploymentForLatestCommit?: Deployment | FetchError;
  latestCommit?: Commit | FetchError;
}

type Props = PassedProps & GeneratedProps;

const BranchSummary = (props: Props) => {
  const {
    branch,
    latestSuccessfulDeployment,
    latestSuccessfullyDeployedCommit,
    deploymentForLatestCommit,
    latestCommit,
  } = props;
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
        <MinardLink
          preview={latestSuccessfulDeployment}
          commit={isFetchError(latestSuccessfullyDeployedCommit) ? undefined : latestSuccessfullyDeployedCommit}
        >
          <SingleCommit
            className={styles.hover}
            deployment={latestSuccessfulDeployment}
            commit={latestSuccessfullyDeployedCommit}
          />
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
        <div className={styles.header}>
          <MinardLink branch={branch}>
            <div className={styles.title}>{branch.name}</div>
          </MinardLink>
          <BuildStatus
            className={styles['build-status']}
            deployment={isFetchError(deploymentForLatestCommit) ? undefined : deploymentForLatestCommit}
            commit={isFetchError(latestCommit) ? undefined : latestCommit}
            latest={true}
          />
        </div>
        <MinardLink branch={branch}>
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

  let latestSuccessfullyDeployedCommit: FetchError | Commit | undefined;

  if (branch.latestSuccessfullyDeployedCommit) {
    latestSuccessfullyDeployedCommit = Commits.selectors.getCommit(state, branch.latestSuccessfullyDeployedCommit);
  }

  let latestSuccessfulDeployment: FetchError | Deployment | undefined;
  if (latestSuccessfullyDeployedCommit &&
    !isFetchError(latestSuccessfullyDeployedCommit) &&
    latestSuccessfullyDeployedCommit.deployment
  ) {
    latestSuccessfulDeployment =
      Deployments.selectors.getDeployment(state, latestSuccessfullyDeployedCommit.deployment);
  }

  let deploymentForLatestCommit: Deployment | FetchError | undefined;
  let latestCommit: Commit | FetchError | undefined;
  if (branch.latestCommit) {
    latestCommit = Commits.selectors.getCommit(state, branch.latestCommit);
    if (latestCommit && !isFetchError(latestCommit) && latestCommit.deployment) {
      deploymentForLatestCommit = Deployments.selectors.getDeployment(state, latestCommit.deployment);
    }
  }

  return {
    latestSuccessfulDeployment,
    latestSuccessfullyDeployedCommit,
    deploymentForLatestCommit,
    latestCommit,
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(BranchSummary);
