import * as React from 'react';
import { connect } from 'react-redux';

import branches, { Branch } from '../../modules/branches';
import commits, { Commit } from '../../modules/commits';
import projects, { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import BranchHeader from './branch-header';
import CommitList from './commit-list';

interface PassedProps {
  params: {
    name: string;
    projectId: string;
  };
}

interface GeneratedProps {
  project: Project;
  branch: Branch;
  commits: Commit[];
}

const BranchView = ({ branch, commits, project }: PassedProps & GeneratedProps) => (
  <div>
    <BranchHeader project={project} branch={branch} />
    <div className="divider" />
    <CommitList commits={commits} />
  </div>
);

const mapStateToProps = (state: StateTree, ownProps: PassedProps) => {
  const project = projects.selectors.getProject(state, ownProps.params.projectId);
  const branch = branches.selectors.getBranchByNameAndProject(
    state,
    ownProps.params.name,
    ownProps.params.projectId
  );
  const branchCommits = branch.commits.map(commitId => commits.selectors.getCommit(state, commitId));

  return {
    project,
    branch,
    commits: branchCommits,
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(BranchView);
