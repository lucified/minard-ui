import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Branch } from '../../modules/branches';

import SectionTitle from '../common/section-title';
import BranchSummary from './branch-summary';

interface Props {
  branches: Branch[];
}

class ProjectBranches extends React.Component<Props, any> {
  private getEmptyContent() {
    return (
      <div className="empty">
        <Icon name="exclamation" fixedWidth size="3x" />
        <p className="empty-title">No branches</p>
        <p className="empty-meta">Is your repository set up correctly?</p>
      </div>
    );
  }

  public render() {
    const { branches } = this.props;

    return (
      <div>
        <SectionTitle>Branches</SectionTitle>
        {(branches.length === 0) ? this.getEmptyContent() : (
          <div className="columns">
            <div className="column col-1" />
            <div className="column col-10">
              {branches.map(branch => <BranchSummary key={branch.id} branch={branch} />)}
            </div>
            <div className="column col-1" />
          </div>
        )}
      </div>
    );
  }
};

export default ProjectBranches;
