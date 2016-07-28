import * as React from 'react';

import { Branch } from '../../modules/branches';
import { Project } from '../../modules/projects';

import MinardLink from './minard-link';

interface Props {
  branch?: Branch;
  project: Project;
}

const Breadcrumbs = ({ branch, project }: Props) => (
  <ul className="breadcrumb">
    <li className="breadcrumb-item">
      <MinardLink project={project}>{project.name}</MinardLink>
    </li>
    {branch && (
      <li className="breadcrumb-item">
        <MinardLink branch={branch}>{branch.name}</MinardLink>
      </li>
    )}
  </ul>
);

export default Breadcrumbs;
