import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Branch } from '../../modules/branches';
import { FetchError, isError } from '../../modules/errors';

import LoadingIcon from '../common/loading-icon';
import SectionTitle from '../common/section-title';
import BranchSummary from './branch-summary';

const styles = require('./project-branches.scss');

interface Props {
  branches: (Branch | FetchError | undefined)[];
}

const getEmptyContent = () => (
  <div className={styles.empty}>
    <h2>No branches</h2>
    <p>Push your first branch to the repository to get started.</p>
  </div>
);

const getLoadingContent = (key: number) => (
  <LoadingIcon center key={key} />
);

const getErrorMessage = (branch: FetchError) => (
  <div key={branch.id!}>
    <Icon name="exclamation" fixedWidth size="3x" />
    <p>Uhhoh. Unable to get branch information</p>
    <p>{branch.prettyError}</p>
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
