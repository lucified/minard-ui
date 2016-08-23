import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';

import Branches, { Branch } from '../../modules/branches';
import Commits, { Commit } from '../../modules/commits';
import { FetchError, isError } from '../../modules/errors';
import Projects, { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import LoadingIcon from '../common/loading-icon';
import MinardLink from '../common/minard-link';
import SubHeader from '../common/sub-header';
import BranchHeader from './branch-header';
import CommitList from './commit-list';

const styles = require('./index.scss');

interface PassedProps {
  params: {
    id: string;
    projectId: string;
  };
}

interface GeneratedStateProps {
  project?: Project | FetchError;
  branch?: Branch | FetchError;
  commits?: (Commit | FetchError | undefined)[];
}

interface GeneratedDispatchProps {
  loadBranch: (id: string) => void;
}

class BranchView extends React.Component<GeneratedStateProps & PassedProps & GeneratedDispatchProps, StateTree> {
  public componentWillMount() {
    const { loadBranch } = this.props;
    const { id } = this.props.params;

    loadBranch(id);
  }

  private getLoadingContent() {
    return (
      <div>
        <SubHeader align="center" />
        <LoadingIcon className={styles.loading} center />
      </div>
    );
  }

  private getErrorContent(error: FetchError) {
    return (
      <div>
        <Icon name="exclamation" fixedWidth size="3x" />
        <p>Error!</p>
        <p>{error.prettyError}</p>
      </div>
    );
  }

  public render() {
    const { branch, commits, project } = this.props;
    if (!branch) {
      return this.getLoadingContent();
    }

    if (isError(branch)) {
      return this.getErrorContent(branch);
    }

    if (!project) {
      return this.getLoadingContent();
    }

    if (isError(project)) {
      return this.getErrorContent(project);
    }

    return (
      <div>
        <SubHeader align="left">
          <MinardLink className={styles['sub-header-link']} project={project}>‹ {project.name}</MinardLink>
        </SubHeader>
        <BranchHeader project={project} branch={branch} />
        <CommitList commits={commits!} />
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedStateProps => {
  const { projectId, id } = ownProps.params;
  const project = Projects.selectors.getProject(state, projectId);
  const branch = Branches.selectors.getBranch(state, id);
  let commits: (Commit | FetchError | undefined)[] | undefined;

  if (branch && !isError(branch)) {
    commits = branch.commits.map(commitId => Commits.selectors.getCommit(state, commitId));
  }

  return {
    project,
    branch,
    commits,
  };
};

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  {
    loadBranch: Branches.actions.loadBranch,
  }
)(BranchView);
