import * as React from 'react';

import { Commit } from '../../modules/commits';

import CommitSummary from '../common/commit-summary';

interface Props {
  commit: Commit;
}

const SingleCommit = ({ commit }: Props) => (
  <div className="columns">
    <div className="column col-3">
      {commit.hasDeployment && <img src={commit.screenshot} className="img-responsive" />}
    </div>
    <div className="column col-9">
      <CommitSummary key={commit.hash} commit={commit} />
    </div>
  </div>
);

export default SingleCommit;
