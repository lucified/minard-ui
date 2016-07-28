import * as React from 'react';

import { Commit } from '../../modules/commits';

import CommitSummary from '../common/commit-summary';
import MinardLink from '../common/minard-link';

interface Props {
  commit: Commit;
}

const SingleCommit = ({ commit }: Props) => (
  <div className="columns">
    <div className="column col-3">
      {commit.hasDeployment && (
        <MinardLink commit={commit}>
          <img src={commit.screenshot} className="img-responsive" />
        </MinardLink>
      )}
    </div>
    <div className="column col-9">
      <CommitSummary key={commit.hash} commit={commit} enableLink={commit.hasDeployment} />
    </div>
  </div>
);

export default SingleCommit;
