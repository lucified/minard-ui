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

const projectInfo = (projects: (Project | FetchError)[]) =>
  projects.map(project => <ProjectSummary key={project.id!} project={project} />);

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
    {projects && (
      <div className="columns">
        <div className="column col-1" />
        <div className="column col-10">
          {projectInfo(projects)}
        </div>
        <div className="column col-1" />
      </div>
    )}
  </div>
);

export default ProjectsSection;
