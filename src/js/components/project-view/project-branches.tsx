import * as classNames from 'classnames';
import * as React from 'react';

import { Branch } from '../../modules/branches';
import { FetchError, isFetchError } from '../../modules/errors';
import { Project } from '../../modules/projects';

import LoadingIcon from '../common/loading-icon';
import MinardLink from '../common/minard-link';
import SectionTitle from '../common/section-title';
import BranchSummary from './branch-summary';

const styles = require('./project-branches.scss');

interface Props {
  branches: (Branch | FetchError | undefined)[] | undefined;
  project: Project;
  showAll?: boolean;
  count?: number;
}

const getEmptyContent = () => (
  <div className={styles.empty}>
    <h2>No branches</h2>
    <p>Push your first branch to the repository to get started.</p>
  </div>
);

const getBranches = (branches: (Branch | undefined)[]) => {
  return branches.map((branch, i) => {
    if (!branch) {
      return <LoadingIcon center key={i} />;
    }

    return <BranchSummary key={branch.id} branch={branch} />;
  });
};

const ProjectBranches = ({ branches, project, showAll, count = 3 }: Props) => {
  const title = showAll ? `All branches for ${project.name}` : 'Branches';

  if (!branches) {
    return (
      <section className="container">
        <SectionTitle><span>{title}</span></SectionTitle>
        <LoadingIcon className={styles.loading} center />
      </section>
    );
  }

  const filteredBranches = branches.filter(branch => !isFetchError(branch)) as (Branch | undefined)[];
  const branchesToShow = showAll ? filteredBranches : filteredBranches.slice(0, count);
  const content = (branchesToShow.length === 0) ? getEmptyContent() : getBranches(branchesToShow);

  return (
    <section className="container">
      <SectionTitle><span>{title}</span></SectionTitle>
      {content}
      {(!showAll && filteredBranches.length > count) && (
        <div className="row end-xs">
          <div className={classNames('col-xs-12', styles['show-all-branches-section'])}>
            <MinardLink className={styles['show-all-branches-link']} showAll project={project}>
              Show all branches ({filteredBranches.length})
            </MinardLink>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectBranches;
