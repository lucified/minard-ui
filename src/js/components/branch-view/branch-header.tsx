import * as classNames from 'classnames';
import * as React from 'react';

import { Branch } from '../../modules/branches';
import { Project } from '../../modules/projects';

import MinardLink from '../common/minard-link';
import SectionTitle from '../common/section-title';

const styles = require('./branch-header.scss');

interface Props {
  branch: Branch;
  project: Project;
}

const BranchHeader = ({ branch, project }: Props) => (
  <section className="container">
    <SectionTitle
        rightContent={(
          <a href="#" className={styles['delete-branch-link']}>
            Delete branch
          </a>
        )}
    >
      <span className={styles.title}>
        <MinardLink project={project}>
          <span className={styles.project}>{project.name}</span>
        </MinardLink>
        {` / ${branch.name}`}
      </span>
    </SectionTitle>
    <div className="row">
      <div className={classNames(styles.description, 'col-xs-12', 'center-xs')}>
        {branch.description}
      </div>
    </div>
  </section>
);

export default BranchHeader;
