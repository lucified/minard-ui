import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

import { Commit } from '../../modules/commits';
import Deployments, { Deployment, isSuccessful } from '../../modules/deployments';
import { isFetchError } from '../../modules/errors';
import { StateTree } from '../../reducers';

import BuildStatus from '../common/build-status';
import MinardLink from '../common/minard-link';
import SingleCommit from '../common/single-commit';

const styles = require('./commit-row.scss');

interface PassedProps {
  commit?: Commit;
}

interface GeneratedProps {
  deployment?: Deployment;
}

const getScreenshotOrBuildBadge = (deployment?: Deployment, commit?: Commit) => {
  if (!deployment || !isSuccessful(deployment)) {
    return (
      <BuildStatus
        className={styles['build-status']}
        deployment={deployment}
        commit={commit}
        latest={false}
      />
    );
  }

  return (
    <MinardLink preview={{ deployment }}>
      <img className={styles.screenshot} src={deployment.screenshot} />
    </MinardLink>
  );
};

const CommitRow = ({ commit, deployment }: PassedProps & GeneratedProps) => (
  <div className={classNames('row', styles['commit-row'])}>
    <div className="col-xs-2 end-xs">
      {getScreenshotOrBuildBadge(deployment, commit)}
    </div>
    <div className={classNames(styles['commit-container'], 'col-xs-10')}>
      <div className={styles['commit-wrap']}>
        {deployment ? (
          <MinardLink className={styles.commit} preview={{ deployment }}>
            <SingleCommit commit={commit} deployment={deployment} />
          </MinardLink>
        ) : <SingleCommit commit={commit} deployment={deployment} />}
      </div>
    </div>
  </div>
);

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => {
  const { commit } = ownProps;

  if (commit && commit.deployment) {
    const deploymentOrError = Deployments.selectors.getDeployment(state, commit.deployment);

    return {
      deployment: isFetchError(deploymentOrError) ? undefined : deploymentOrError,
    };
  }

  return {};
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(CommitRow);
