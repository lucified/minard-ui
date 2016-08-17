import * as classNames from 'classnames';
import * as React from 'react';

import { FetchError } from '../../modules/errors';
import { Project } from '../../modules/projects';

import SectionTitle from '../common/section-title';
import ProjectSummary from './project-summary';

const styles = require('./projects-section.scss');

interface Props {
  projects?: (Project | FetchError)[];
}

const projectCards = (projects: (Project | FetchError)[]) => {
  return (
    <div className="row center-xs start-sm">
      {projects.map(project => (
        <div key={project.id!} className={classNames('col-xs-12', 'col-sm-6', 'col-md-4', styles['project-card'])}>
          <ProjectSummary project={project} />
        </div>
      ))}
    </div>
  );
};

const ProjectsSection = ({ projects }: Props) => (
  <section className="container">
    <SectionTitle
      rightContent={(
        <a href="#" className={classNames(styles['add-project-link'])}>
          + Add new project
        </a>
      )}
    >
      {projects ? (
        <span>
          {projects.length} projects for{' '}
          <span className={styles.team}>Team Lucify</span>
        </span>
      ) : (
        <span>
          Loading projects...
        </span>
      )}
    </SectionTitle>
    {projects && projectCards(projects)}
  </section>
);

export default ProjectsSection;
