import * as React from 'react';
import { connect } from 'react-redux';

import Branches, { Branch } from '../../modules/branches';
import Commits, { Commit } from '../../modules/commits';
import { FetchError, isFetchError } from '../../modules/errors';
import Projects, { Project } from '../../modules/projects';
import Requests from '../../modules/requests';
import { StateTree } from '../../reducers';

import LoadingIcon from '../common/loading-icon';
import BranchHeader from './branch-header';
import CommitList from './commit-list';

const styles = require('./index.scss');

interface PassedProps {
  params: {
    branchId: string;
    projectId: string;
  };
}

interface GeneratedStateProps {
  project?: Project | FetchError;
  branch?: Branch | FetchError;
  commits?: (Commit | FetchError | undefined)[];
  isLoadingCommits: boolean;
}

interface GeneratedDispatchProps {
  loadBranch: (id: string) => void;
  loadCommits: (id: string, count?: number, until?: number) => void;
}

class BranchView extends React.Component<GeneratedStateProps & PassedProps & GeneratedDispatchProps, StateTree> {
  public componentWillMount() {
    const { loadBranch, loadCommits } = this.props;
    const { branchId } = this.props.params;

    loadBranch(branchId);
    loadCommits(branchId, 10);
  }

  public componentWillReceiveProps(nextProps: GeneratedStateProps & PassedProps & GeneratedDispatchProps) {
    const { loadBranch, loadCommits } = this.props;
    const { branchId } = nextProps.params;

    // This happens if the user manually opens a new branch when another branch is open
    if (branchId !== this.props.params.branchId) {
      loadBranch(branchId);
      loadCommits(branchId, 10);
    }
  }

  private reloadPage(e: any) {
    location.reload(true);
    return false;
  }

  private getLoadingContent() {
    return <LoadingIcon className={styles.loading} center />;
  }

  private getErrorContent(error: FetchError) {
    return (
      <div className={styles.error}>
        <h2>Unable to load branch</h2>
        <p><a onClick={this.reloadPage}>Click to reload</a></p>
        <small>{error.prettyError}</small>
      </div>
    );
  }

  public render() {
    const { branch, commits, project, loadCommits, isLoadingCommits } = this.props;

    if (!branch) {
      return this.getLoadingContent();
    }

    if (isFetchError(branch)) {
      return this.getErrorContent(branch);
    }

    if (!project) {
      return this.getLoadingContent();
    }

    if (isFetchError(project)) {
      return this.getErrorContent(project);
    }

    return (
      <div>
        <BranchHeader project={project} branch={branch} />
        <CommitList
          commits={commits!}
          isLoading={isLoadingCommits}
          allLoaded={branch.allCommitsLoaded}
          loadCommits={loadCommits.bind(this, branch.id)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedStateProps => {
  const { projectId, branchId } = ownProps.params;
  const project = Projects.selectors.getProject(state, projectId);
  const branch = Branches.selectors.getBranch(state, branchId);
  let commits: (Commit | FetchError | undefined)[] | undefined;
  const isLoadingCommits = Requests.selectors.isLoadingCommitsForBranch(state, branchId);

  if (branch && !isFetchError(branch)) {
    commits = branch.commits.map(commitId => Commits.selectors.getCommit(state, commitId));
  }

  return {
    project,
    branch,
    commits,
    isLoadingCommits,
  };
};

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  {
    loadBranch: Branches.actions.loadBranch,
    loadCommits: Commits.actions.loadCommitsForBranch,
  },
)(BranchView);
