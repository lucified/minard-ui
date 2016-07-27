import * as React from 'react';
import { Link } from 'react-router';

import { Branch } from '../../modules/branches';
import { Project } from '../../modules/projects';

interface Props {
  branch?: Branch;
  project: Project;
}

const Breadcrumbs = ({ branch, project }: Props) => (
  <ul className="breadcrumb">
    <li className="breadcrumb-item">
      <Link to={`/project/${project.id}`}>{project.name}</Link>
    </li>
    {branch && (
      <li className="breadcrumb-item">
        <Link to={`/project/${project.id}/${branch.name}`}>{branch.name}</Link>
      </li>
    )}
  </ul>
);

export default Breadcrumbs;
