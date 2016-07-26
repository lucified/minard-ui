import * as React from 'react';
import { Link } from 'react-router';

import { Project } from '../modules/projects';

interface Props {
  project: Project;
}

const ProjectSummary = ({ project }: Props) => (
  <div className="columns">
    <div className="column col-12">
      <Link to={`/project/${project.id}`}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              {project.name}
            </div>
          </div>
        </div>
      </Link>
    </div>
  </div>
);

export default ProjectSummary;
