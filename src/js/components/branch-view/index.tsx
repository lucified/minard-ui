import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import Branches, { Branch } from '../../modules/branches';
import Commits, { Commit } from '../../modules/commits';
import { FetchError, isFetchError } from '../../modules/errors';
import Projects, { Project } from '../../modules/projects';
import Requests from '../../modules/requests';
import { StateTree } from '../../reducers';

import LoadingIcon from '../common/loading-icon';
import CommitList from './commit-list';

const styles = require('./index.scss');

interface Params {
  branchId: string;
  projectId: string;
}

type PassedProps = RouteComponentProps<Params>;

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

type Props = GeneratedStateProps & PassedProps & GeneratedDispatchProps;

class BranchView extends React.Component<Props, StateTree> {
  public componentWillMount() {
    const {
      loadBranch,
      loadCommits,
      match: { params: { branchId } },
    } = this.props;

    loadBranch(branchId);
    loadCommits(branchId, 10);
  }

  public componentWillReceiveProps(nextProps: Props) {
    const {
      loadBranch,
      loadCommits,
      match: { params: { branchId } },
    } = this.props;
    const { branchId: nextBranchId } = nextProps.match.params;

    // This happens if the user manually opens a new branch when another branch is open
    if (branchId !== nextBranchId) {
      loadBranch(nextBranchId);
      loadCommits(nextBranchId, 10);
    }
  }

  private reloadPage(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();

    location.reload(true);
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
    const {
      branch,
      commits,
      project,
      loadCommits,
      isLoadingCommits,
    } = this.props;

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

    if (isLoadingCommits && commits!.length === 0) {
      return this.getLoadingContent();
    }

    return (
      <div className={styles.root}>
        <div className="container-fluid">
          <CommitList
            commits={commits!}
            isLoading={isLoadingCommits}
            allLoaded={branch.allCommitsLoaded}
            loadCommits={loadCommits.bind(this, branch.id)}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (
  state: StateTree,
  ownProps: PassedProps,
): GeneratedStateProps => {
  const { projectId, branchId } = ownProps.match.params;
  const project = Projects.selectors.getProject(state, projectId);
  const branch = Branches.selectors.getBranch(state, branchId);
  let commits: (Commit | FetchError | undefined)[] | undefined;
  const isLoadingCommits = Requests.selectors.isLoadingCommitsForBranch(
    state,
    branchId,
  );

  if (branch && !isFetchError(branch)) {
    commits = branch.commits.map(commitId =>
      Commits.selectors.getCommit(state, commitId),
    );
  }

  return {
    project,
    branch,
    commits,
    isLoadingCommits,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<any>,
): GeneratedDispatchProps => {
  return {
    loadBranch: (id: string) => {
      dispatch(Branches.actions.loadBranch(id));
    },
    loadCommits: (id: string, count: number, until?: number) => {
      dispatch(Commits.actions.loadCommitsForBranch(id, count, until));
    },
  };
};

export default connect<
  GeneratedStateProps,
  GeneratedDispatchProps,
  PassedProps
>(mapStateToProps, mapDispatchToProps)(BranchView);
