import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { FetchError } from '../../modules/errors';
import { Project } from '../../modules/projects';

import SectionTitle from '../common/section-title';
import ProjectSummary from './project-summary';

interface Props {
  projects?: (Project | FetchError)[];
}

const loadingBanner = (
  <div className="empty">
    <Icon name="circle-o-notch" spin fixedWidth size="3x" />
    <p className="empty-title">Loading projects</p>
    <p className="empty-meta">Hold on a sec…</p>
  </div>
);

const projectInfo = (projects: (Project | FetchError)[]) =>
  projects.map(project => <ProjectSummary key={project.id} project={project} />);

const ProjectsSection = ({ projects }: Props) => (
  <div>
    <SectionTitle>Projects</SectionTitle>
    <div className="columns">
      <div className="column col-1" />
      <div className="column col-10">
        { projects ? projectInfo(projects) : loadingBanner }
      </div>
      <div className="column col-1" />
    </div>
  </div>
);

export default ProjectsSection;
