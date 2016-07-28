import * as React from 'react';

import { Project } from '../../modules/projects';

import SectionTitle from '../common/section-title';
import ProjectSummary from './project-summary';


interface Props {
  projects: Project[];
}

const ProjectsSection = ({ projects }: Props) => (
  <div>
    <SectionTitle>Projects</SectionTitle>
    <div className="columns">
      <div className="column col-1" />
      <div className="column col-10">
        {projects.map(project => <ProjectSummary key={project.id} project={project} />)}
      </div>
      <div className="column col-1" />
    </div>
  </div>
);

export default ProjectsSection;
