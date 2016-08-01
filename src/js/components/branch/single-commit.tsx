import * as React from 'react';
import { connect } from 'react-redux';

import { Commit } from '../../modules/commits';
import deployments, { Deployment } from '../../modules/deployments';
import { StateTree } from '../../reducers';

import CommitSummary from '../common/commit-summary';
import MinardLink from '../common/minard-link';

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
          <img src={deployment.screenshot} className="img-responsive" />
        </MinardLink>
      )}
    </div>
    <div className="column col-9">
      <CommitSummary key={commit.hash} commit={commit} deployment={deployment} />
    </div>
  </div>
);


const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => {
  if (ownProps.commit.deployment) {
    return {
      deployment: deployments.selectors.getDeployment(state, ownProps.commit.deployment),
    };
  }

  return {};
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(SingleCommit);
