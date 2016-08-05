import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';

import Branches, { Branch } from '../../modules/branches';
import Commits, { Commit } from '../../modules/commits';
import Projects, { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import BranchHeader from './branch-header';
import CommitList from './commit-list';

interface PassedProps {
  params: {
    id: string;
    projectId: string;
  };
}

interface GeneratedProps {
  project: Project;
  branch: Branch;
  commits: Commit[];
}

interface GeneratedDispatchProps {
  loadProject: (id: string) => void;
  loadBranch: (id: string) => void;
}

class BranchView extends React.Component<GeneratedProps & PassedProps & GeneratedDispatchProps, StateTree> {
  public componentWillMount() {
    const { loadProject, loadBranch } = this.props;
    const { projectId, id } = this.props.params;

    loadProject(projectId);
    loadBranch(id);
  }

  private getLoadingContent() {
    return (
      <div className="empty">
        <Icon name="circle-o-notch" spin fixedWidth size="3x" />
        <p className="empty-title">Loading branch</p>
        <p className="empty-meta">Hold on a sec…</p>
      </div>
    );
  }

  public render() {
    const { branch, commits, project } = this.props;
    if (!project || !branch) {
      return this.getLoadingContent();
    }

    return (
      <div>
        <BranchHeader project={project} branch={branch} />
        <div className="divider" />
        <CommitList commits={commits} />
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree, ownProps: PassedProps) => {
  const { projectId, id } = ownProps.params;
  const project = Projects.selectors.getProject(state, projectId);
  const branch = Branches.selectors.getBranch(state, id);

  let commits: Commit[];
  if (branch) {
    commits = branch.commits.map(commitId => Commits.selectors.getCommit(state, commitId));
  }

  return {
    project,
    branch,
    commits,
  };
};

export default connect<GeneratedProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  {
    loadBranch: Branches.actions.loadBranch,
    loadProject: Projects.actions.loadProject,
  }
)(BranchView);
