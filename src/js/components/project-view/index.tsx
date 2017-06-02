import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import Activities, { Activity } from '../../modules/activities';
import Branches, { Branch } from '../../modules/branches';
import { FetchError, isFetchError } from '../../modules/errors';
import Projects, { Project } from '../../modules/projects';
import Requests from '../../modules/requests';
import { StateTree } from '../../reducers';

import LoadingIcon from '../common/loading-icon';
import EmptyProject from './empty-project';
import ProjectActivity from './project-activity';
import ProjectBranches from './project-branches';
import ProjectSettingsDialog from './project-settings-dialog';

const styles = require('./index.scss');

interface Params {
  projectId: string;
  show?: string;
}

type PassedProps = RouteComponentProps<Params>;

interface GeneratedStateProps {
  project?: Project | FetchError;
  branches?: (Branch | FetchError | undefined)[] | FetchError;
  activities?: Activity[];
  isLoadingActivities: boolean;
  isAllActivitiesRequestedForProject: boolean;
}

interface GeneratedDispatchProps {
  loadProject: (id: string) => void;
  loadActivities: (id: string, count: number, until?: number) => void;
  loadBranches: (id: string) => void;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps;

class ProjectView extends React.Component<Props, void> {
  public componentWillMount() {
    const { loadProject, loadActivities, loadBranches } = this.props;
    const { projectId } = this.props.match.params;

    loadProject(projectId);
    loadBranches(projectId);
    loadActivities(projectId, 10);
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { loadProject, loadActivities, loadBranches } = this.props;
    const { projectId } = nextProps.match.params;

    if (projectId !== this.props.match.params.projectId) {
      loadProject(projectId);
      loadBranches(projectId);
      loadActivities(projectId, 10);
    }
  }

  private reloadPage(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    location.reload(true);
  }

  public render() {
    const {
      project,
      branches,
      activities,
      loadActivities,
      isLoadingActivities,
      isAllActivitiesRequestedForProject,
      match: { params: { show } },
    } = this.props;

    if (isFetchError(project)) {
      return (
        <div className={styles.error}>
          <h2>Unable to load project</h2>
          <p><a onClick={this.reloadPage}>Click to reload</a></p>
          <small>{project.prettyError}</small>
        </div>
      );
    }

    if (isFetchError(branches)) {
      return (
        <div className={styles.error}>
          <h2>Unable to load branches</h2>
          <p><a onClick={this.reloadPage}>Click to reload</a></p>
          <small>{branches.prettyError}</small>
        </div>
      );
    }

    if (!project) {
      return <LoadingIcon className={styles.loading} center />;
    }

    if (show === 'all') {
      return <ProjectBranches project={project} branches={branches} showAll />;
    }

    let mainContent: JSX.Element;

    if (!branches) {
      mainContent = <LoadingIcon className={styles.loading} center />;
    } else {
      if (branches.length === 0) {
        mainContent = <EmptyProject project={project} />;
      } else {
        mainContent = (
          <div>
            <div className="container-fluid">
              <div className="row">
                <div className="col-xs-12 col-sm-8">
                  <ProjectActivity
                    project={project}
                    activities={activities!}
                    loadActivities={loadActivities.bind(this, project.id)}
                    isLoading={isLoadingActivities}
                    allLoaded={isAllActivitiesRequestedForProject}
                  />
                </div>
                <div className="col-xs-12 col-sm-4">
                  <div className={styles.branches}>
                    <ProjectBranches
                      project={project}
                      branches={branches}
                      count={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <div className={styles.root}>
        <ProjectSettingsDialog project={project} />
        {mainContent}
      </div>
    );
  }
}

const mapStateToProps = (
  state: StateTree,
  ownProps: PassedProps,
): GeneratedStateProps => {
  const { projectId } = ownProps.match.params;
  const project = Projects.selectors.getProject(state, projectId);
  const isLoadingActivities = Requests.selectors.isLoadingActivitiesForProject(
    state,
    projectId,
  );
  const isAllActivitiesRequestedForProject = Requests.selectors.isAllActivitiesRequestedForProject(
    state,
    projectId,
  );

  if (!project || isFetchError(project)) {
    return {
      project,
      isLoadingActivities,
      isAllActivitiesRequestedForProject,
    };
  }

  let branches: (Branch | FetchError | undefined)[] | undefined | FetchError;
  const branchIDs = project.branches;
  if (branchIDs) {
    branches = isFetchError(branchIDs)
      ? branchIDs
      : branchIDs.map(branchId =>
          Branches.selectors.getBranch(state, branchId),
        );
  }

  return {
    project,
    isLoadingActivities,
    isAllActivitiesRequestedForProject,
    branches,
    activities: Activities.selectors.getActivitiesForProject(state),
  };
};

const dispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  loadProject: (id: string) => {
    dispatch(Projects.actions.loadProject(id));
  },
  loadActivities: (id: string, count: number, until?: number) => {
    dispatch(Activities.actions.loadActivitiesForProject(id, count, until));
  },
  loadBranches: (id: string) => {
    dispatch(Branches.actions.loadBranchesForProject(id));
  },
});

export default connect<
  GeneratedStateProps,
  GeneratedDispatchProps,
  PassedProps
>(mapStateToProps, dispatchToProps)(ProjectView);
