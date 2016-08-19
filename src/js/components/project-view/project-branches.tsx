import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Branch } from '../../modules/branches';
import { FetchError, isError } from '../../modules/errors';

import SectionTitle from '../common/section-title';
import BranchSummary from './branch-summary';

interface Props {
  branches: (Branch | FetchError | undefined)[];
}

const getEmptyContent = () => (
  <div className="empty">
    <Icon name="exclamation" fixedWidth size="3x" />
    <p className="empty-title">No branches</p>
    <p className="empty-meta">Is your repository set up correctly?</p>
  </div>
);

const getLoadingContent = (key: number) => (
  <div key={key} className="empty">
    <Icon name="circle-o-notch" spin fixedWidth size="3x" />
    <p className="empty-title">Loading branch</p>
    <p className="empty-meta">Hold on a sec…</p>
  </div>
);

const getErrorMessage = (branch: FetchError) => (
  <div key={branch.id!} className="empty">
    <Icon name="exclamation" fixedWidth size="3x" />
    <p className="empty-title">Uhhoh. Unable to get branch information</p>
    <p className="empty-meta">{branch.prettyError}</p>
  </div>
);

const getBranches = (branches: (Branch | FetchError | undefined)[]) => {
  return branches.map((branch, i) => {
    if (!branch) {
      return getLoadingContent(i);
    } else if (isError(branch)) {
      return getErrorMessage(branch);
    }

    return <BranchSummary key={branch.id} branch={branch} />;
  });
};

const ProjectBranches = ({ branches }: Props) => (
  <section className="container">
    <SectionTitle><span>Branches</span></SectionTitle>
    {(branches.length === 0) ? getEmptyContent() : getBranches(branches)}
  </section>
);

export default ProjectBranches;