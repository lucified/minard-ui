import * as classNames from 'classnames';
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

const getBranches = (branches: (Branch | FetchError | undefined)[]) => {
  return branches.map((branch, i) => {
    if (!branch) {
      return <LoadingIcon center key={i} />;
    }

    return <BranchSummary key={branch.id} branch={branch} />;
  });
};

const ProjectBranches = ({ branches, project, showAll, count = 3 }: Props) => {
  let content: JSX.Element | JSX.Element[];
  if (branches) {
    const branchesToShow = showAll ? branches : branches.slice(0, count);
    content = (branchesToShow.length === 0) ? getEmptyContent() : getBranches(branchesToShow);
  } else {
    content = <LoadingIcon className={styles.loading} center />;
  }

  const title = showAll ? `All branches for ${project.name}` : 'Branches';

  return (
    <section className="container">
      <SectionTitle><span>{title}</span></SectionTitle>
      {content}
      {(!showAll && branches && branches.length > count) && (
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
