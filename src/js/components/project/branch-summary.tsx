import * as React from 'react';

import { Branch } from '../../modules/branches';

const screenshot = require('../../../images/screenshot.png');

interface Props {
  branch: Branch;
}

const BranchSummary = ({ branch }: Props) => (
  <div className="columns">
    <div className="column col-3">
      <img className="img-responsive" src={screenshot} />
    </div>
    <div className="column col-9">
      {branch.name}
    </div>
  </div>
);

export default BranchSummary;
