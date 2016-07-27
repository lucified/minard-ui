import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Branch } from '../../modules/branches';
import { Project } from '../../modules/projects';

import SectionTitle from '../common/section-title';
import BranchSummary from './branch-summary';

interface Props {
  branches: Branch[];
  project: Project;
}

const ProjectBranches = ({ branches, project }: Props) => (
  <div>
    <SectionTitle>Branches</SectionTitle>
    {(branches.length === 0) ? (
      <div className="empty">
        <Icon name="exclamation" fixedWidth size="3x" />
        <p className="empty-title">No branches</p>
        <p className="empty-meta">Is your repository set up correctly?</p>
      </div>
    ) : (
      <div className="columns">
        <div className="column col-1" />
        <div className="column col-10">
          {branches.map(branch => <BranchSummary key={branch.id} branch={branch} project={project} />)}
        </div>
        <div className="column col-1" />
      </div>
    )}
  </div>
);

export default ProjectBranches;
