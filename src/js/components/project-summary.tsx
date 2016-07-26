import * as React from 'react';
import { Link } from 'react-router';

import { Project } from '../modules/projects';

interface Props {
  project: Project;
}

const ProjectSummary = ({ project }: Props) => (
  <div>
    <Link to={`/project/${project.id}`}>{project.name}</Link>
  </div>
);

export default ProjectSummary;
