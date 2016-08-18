import * as React from 'react';
import { connect } from 'react-redux';

import { Commit } from '../../modules/commits';
import Deployments, { Deployment } from '../../modules/deployments';
import { isError } from '../../modules/errors';
import { StateTree } from '../../reducers';

import MinardLink from '../common/minard-link';
import SingleCommit from '../common/single-commit';

const screenshot = [
  require('../../../images/screenshot-1.png'),
  require('../../../images/screenshot-2.png'),
];

interface PassedProps {
  commit: Commit;
}

interface GeneratedProps {
  deployment?: Deployment;
}

const getDeploymentScreenshot = (deployment: Deployment) => {
  if (!deployment || !deployment.url) { // TODO: !deployment.screenshot) {
    return null;
  }

  return (
    <MinardLink deployment={deployment} openInNewWindow>
      <img src={screenshot[Math.round(Math.random())] /* TODO: deployment.screenshot*/} />
    </MinardLink>
  );
};

const CommitRow = ({ commit, deployment }: PassedProps & GeneratedProps) => (
  <div className="columns">
    <div className="column col-3">
      {getDeploymentScreenshot(deployment)}
    </div>
    <div className="column col-9">
      <SingleCommit commit={commit} />
    </div>
  </div>
);

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => {
  const { commit } = ownProps;

  if (commit.deployment) {
    let deploymentOrError = Deployments.selectors.getDeployment(state, commit.deployment);

    return {
      deployment: isError(deploymentOrError) ? undefined : deploymentOrError,
    };
  }

  return {};
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(CommitRow);
