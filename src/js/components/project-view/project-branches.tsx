import * as React from 'react';

import { Branch } from '../../modules/branches';
import { FetchError } from '../../modules/errors';
import { Project } from '../../modules/projects';

import LoadingIcon from '../common/loading-icon';
import MinardLink from '../common/minard-link';
import SectionTitle from '../common/section-title';
import BranchSummary from './branch-summary';

const styles = require('./project-branches.scss');

interface Props {
  branches: (Branch | FetchError | undefined)[];
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

const getLoadingContent = (key: number) => (
  <LoadingIcon center key={key} />
);

const getBranches = (branches: (Branch | FetchError | undefined)[]) => {
  return branches.map((branch, i) => {
    if (!branch) {
      return getLoadingContent(i);
    }

    return <BranchSummary key={branch.id} branch={branch} />;
  });
};

const ProjectBranches = ({ branches, project, showAll, count = 3 }: Props) => {
  const branchesToShow = showAll ? branches : branches.slice(0, count);
  const content = (branchesToShow.length === 0) ? getEmptyContent() : getBranches(branchesToShow);
  const title = showAll ? 'All branches' : 'Branches';

  return (
    <section className="container">
      <SectionTitle><span>{title}</span></SectionTitle>
      {content}
      {(!showAll && branches.length > count) && (
        <div className="row end-xs">
          <div className={classNames('col-xs-12', styles['show-all-branches-section'])}>
            <MinardLink className={styles['show-all-branches-link']} showAll project={project}>
              Show all branches ({branches.length})
            </MinardLink>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectBranches;
