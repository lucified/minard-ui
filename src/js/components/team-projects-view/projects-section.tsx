import * as classNames from 'classnames';
import * as React from 'react';

import { FetchError } from '../../modules/errors';
import { Project } from '../../modules/projects';

import LoadingIcon from '../common/loading-icon';
import SectionTitle from '../common/section-title';
import ProjectSummary from './project-summary';

const styles = require('./projects-section.scss');

interface Props {
  projects: (Project | FetchError)[];
  isLoading: boolean;
}

const ProjectsSection = ({ projects, isLoading }: Props) => (
  <section className="container">
    <SectionTitle
      rightContent={(
        <a href="#" className={classNames(styles['add-project-link'])}>
          + Add new project
        </a>
      )}
    >
      <span>
        {isLoading ? 'Projects for ' : `${projects.length} projects for `}
        <span className={styles.team}>Team Lucify</span>
      </span>
    </SectionTitle>
    <div className="row center-xs start-sm">
      {projects.map(project => (
        <div key={project.id!} className={classNames('col-xs-12', 'col-sm-6', 'col-md-4', styles['project-card'])}>
          <ProjectSummary project={project} />
        </div>
      ))}
      {isLoading && (
        <div className={classNames('col-xs-12', 'col-sm-6', 'col-md-4', styles['project-card'])}>
          <LoadingIcon className={styles.loading} center />
        </div>
      )}
    </div>
  </section>
);

export default ProjectsSection;
