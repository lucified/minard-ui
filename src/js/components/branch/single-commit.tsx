import * as React from 'react';
import { connect } from 'react-redux';

import { Commit } from '../../modules/commits';
import Deployments, { Deployment } from '../../modules/deployments';
import { StateTree } from '../../reducers';

import CommitSummary from '../common/commit-summary';
import MinardLink from '../common/minard-link';

const screenshot = require('../../../images/screenshot.png');

interface PassedProps {
  commit: Commit;
}

interface GeneratedProps {
  deployment?: Deployment;
}

const SingleCommit = ({ commit, deployment }: PassedProps & GeneratedProps) => (
  <div className="columns">
    <div className="column col-3">
      {commit.deployment && (
        <MinardLink deployment={deployment}>
          <img src={screenshot /* TODO: deployment.screenshot*/} className="img-responsive" />
        </MinardLink>
      )}
    </div>
    <div className="column col-9">
      <CommitSummary key={commit.id} commit={commit} deployment={deployment} />
    </div>
  </div>
);

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => {
  const { commit } = ownProps;

  if (commit.deployment) {
    return {
      deployment: Deployments.selectors.getDeployment(state, commit.deployment),
    };
  }

  return {};
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(SingleCommit);
