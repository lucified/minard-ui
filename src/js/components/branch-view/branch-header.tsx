// import * as classNames from 'classnames';
import * as React from 'react';
// import * as Icon from 'react-fontawesome';

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
      /* TODO: Add this once we add support for deleting branches
      rightContent={(
        <a href="#" className={styles['delete-branch-link']}>
          <Icon className={styles.icon} name="trash-o" /> Delete branch
        </a>
      )}
      */
    >
      <span className={styles.title}>
        <MinardLink project={project}>
          <span className={styles.project}>{project.name}</span>
        </MinardLink>
        {` / ${branch.name}`}
      </span>
    </SectionTitle>
    {/* TODO: Add this once we add support for branch descriptions
    <div className="row">
      <div className={classNames(styles.description, 'col-xs-12', 'center-xs')}>
        {branch.description}
      </div>
    </div>
    */}
  </section>
);

export default BranchHeader;
