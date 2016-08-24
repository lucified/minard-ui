import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

import { Commit } from '../../modules/commits';
import Deployments, { Deployment } from '../../modules/deployments';
import { FetchError, isError } from '../../modules/errors';
import { StateTree } from '../../reducers';

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
  if (!deployment || !deployment.screenshot) {
    return null;
  }

  return (
    <img className={styles.screenshot} src={deployment.screenshot} />
  );
};

const CommitRow = ({ commit, deployment }: PassedProps & GeneratedProps) => {
  const content = (
    <div className="row">
      <div className="col-xs-2 end-xs">
        {getDeploymentScreenshot(deployment)}
      </div>
      <div className={classNames(styles['commit-container'], 'col-xs-10')}>
        <SingleCommit className={styles.commit} commit={commit} />
      </div>
    </div>
  );

  if (deployment) {
    return <MinardLink deployment={deployment} openInNewWindow>{content}</MinardLink>;
  }

  return content;
};

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => {
  const { commit } = ownProps;

  if (commit && !isError(commit) && commit.deployment) {
    let deploymentOrError = Deployments.selectors.getDeployment(state, commit.deployment);

    return {
      deployment: isError(deploymentOrError) ? undefined : deploymentOrError,
    };
  }

  return {};
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(CommitRow);
