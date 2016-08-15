import * as classNames from 'classnames';
import * as chunk from 'lodash/chunk';
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
  const projectRows = chunk(projects, 3);

  return (
    <section className="container grid-1200">
      {projectRows.map((projectGroup, i) => (
        <div key={`project-group-${i}`} className="columns">
          {projectGroup.map(project => (
            <div className="column col-4">
              <ProjectSummary key={project.id!} project={project} />
            </div>
          ))}
        </div>
      ))}
    </section>
  );
};

const ProjectsSection = ({ projects }: Props) => (
  <div>
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
          <strong>Team Lucify</strong>
        </span>
      ) : (
        <span>
          Loading projects...
        </span>
      )}
    </SectionTitle>
    {projects && projectCards(projects)}
  </div>
);

export default ProjectsSection;
