import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

import { Commit } from '../../modules/commits';
import Deployments, { Deployment, isSuccessful } from '../../modules/deployments';
import { FetchError, isFetchError } from '../../modules/errors';
import { StateTree } from '../../reducers';

import BuildStatus from '../common/build-status';
import MinardLink from '../common/minard-link';
import SingleCommit from '../common/single-commit';

const styles = require('./commit-row.scss');

interface PassedProps {
  commit?: Commit | FetchError;
}

interface GeneratedProps {
  deployment?: Deployment;
}

const getDeploymentScreenshot = (deployment?: Deployment) => {
  if (!deployment || !isSuccessful(deployment)) {
    return <BuildStatus className={styles['build-status']} deployment={deployment} latest={false} />;
  }

  return (
    <MinardLink deployment={deployment} openInNewWindow>
      <img className={styles.screenshot} src={deployment.screenshot} />
    </MinardLink>
  );
};

const CommitRow = ({ commit, deployment }: PassedProps & GeneratedProps) => (
  <div className={classNames('row', styles['commit-row'])}>
    <div className="col-xs-2 end-xs">
      {getDeploymentScreenshot(deployment)}
    </div>
    <div className={classNames(styles['commit-container'], 'col-xs-10')}>
      <MinardLink className={styles.commit} deployment={deployment} openInNewWindow>
        <SingleCommit commit={commit} deployment={deployment} />
      </MinardLink>
    </div>
  </div>
);

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => {
  const { commit } = ownProps;

  if (commit && !isFetchError(commit) && commit.deployment) {
    let deploymentOrError = Deployments.selectors.getDeployment(state, commit.deployment);

    return {
      deployment: isFetchError(deploymentOrError) ? undefined : deploymentOrError,
    };
  }

  return {};
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(CommitRow);
