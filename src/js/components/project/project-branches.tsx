import * as React from 'react';

import { Branch } from '../../modules/branches';

import BranchSummary from './branch-summary';

interface Props {
  branches: Branch[];
}

class ProjectBranches extends React.Component<Props, any> {
  public render() {
    const { branches } = this.props;

    return (
      <div>
        <div className="columns">
          <div className="column col-12">
            <h4>Branches</h4>
          </div>
        </div>
        <div className="columns">
          <div className="column col-1" />
          <div className="column col-10">
            {branches.map(branch => <BranchSummary branch={branch} />)}
          </div>
          <div className="column col-1" />
        </div>
      </div>
    );
  }
}

export default ProjectBranches;
