import * as React from 'react';

import { Branch } from '../../modules/branches';
import { Project } from '../../modules/projects';

import Breadcrumbs from '../common/breadcrumbs';

interface Props {
  branch: Branch;
  project: Project;
}

const BranchHeader = ({ branch, project }: Props) => (
  <div className="columns">
    <div className="column col-4">
      <Breadcrumbs branch={branch} project={project} />
    </div>
    <div className="column col-6">
      <p>{branch.description}</p>
    </div>
    <div className="column col-2 text-right">
      <a href="#">Delete branch</a>
    </div>
  </div>
);

export default BranchHeader;
