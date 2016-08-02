import * as React from 'react';
import { connect } from 'react-redux';

import Branches, { Branch } from '../../modules/branches';
import Commits, { Commit } from '../../modules/commits';
import Projects, { Project } from '../../modules/projects';
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
  const project = Projects.selectors.getProject(state, ownProps.params.projectId);
  const branch = Branches.selectors.getBranchByNameAndProject(
    state,
    ownProps.params.name,
    ownProps.params.projectId
  );
  const branchCommits = branch.commits.map(commitId => Commits.selectors.getCommit(state, commitId));

  return {
    project,
    branch,
    commits: branchCommits,
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(BranchView);
