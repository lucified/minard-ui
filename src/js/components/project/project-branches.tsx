import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Branch } from '../../modules/branches';
import { FetchError, isError } from '../../modules/errors';

import SectionTitle from '../common/section-title';
import BranchSummary from './branch-summary';

interface Props {
  branches: (Branch | FetchError)[];
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

  private getLoadingContent(key: number) {
    return (
      <div key={key} className="empty">
        <Icon name="circle-o-notch" spin fixedWidth size="3x" />
        <p className="empty-title">Loading branch</p>
        <p className="empty-meta">Hold on a sec…</p>
      </div>
    );
  }

  private getErrorMessage(branch: FetchError) {
    return (
      <div key={branch.id!} className="empty">
        <Icon name="exclamation" fixedWidth size="3x" />
        <p className="empty-title">Uhhoh. Unable to get branch information</p>
        <p className="empty-meta">{branch.prettyError}</p>
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
              {branches.map((branch, i) => {
                if (!branch) {
                  return this.getLoadingContent(i);
                } else if (isError(branch)) {
                  return this.getErrorMessage(branch);
                }

                return <BranchSummary key={branch.id} branch={branch} />;
              })}
            </div>
            <div className="column col-1" />
          </div>
        )}
      </div>
    );
  }
};

export default ProjectBranches;
