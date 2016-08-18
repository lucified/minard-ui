import * as React from 'react';

import { Branch } from '../../modules/branches';
import { Project } from '../../modules/projects';

interface Props {
  branch: Branch;
  project: Project;
}

const BranchHeader = ({ branch, project }: Props) => (
  <div className="columns">
    <div className="column col-4">

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
