import * as React from 'react';
import { connect } from 'react-redux';

import Activities, { Activity } from '../../modules/activities';
import Branches, { Branch } from '../../modules/branches';
import { FetchError, isFetchError } from '../../modules/errors';
import Projects, { Project } from '../../modules/projects';
import Requests from '../../modules/requests';
import { StateTree } from '../../reducers';

import LoadingIcon from '../common/loading-icon';
import ProjectActivity from './project-activity';
import ProjectBranches from './project-branches';
import ProjectHeader from './project-header';
import ProjectSettingsDialog from './project-settings-dialog';

const styles = require('./index.scss');

interface PassedProps {
  params: {
    projectId: string;
    show?: string;
  };
}

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

class ProjectView extends React.Component<PassedProps & GeneratedStateProps & GeneratedDispatchProps, any> {
  public componentWillMount() {
    const { loadProject, loadActivities, loadBranches } = this.props;
    const { projectId } = this.props.params;

    loadProject(projectId);
    loadBranches(projectId);
    loadActivities(projectId, 10);
  }

  private reloadPage(e: any) {
    location.reload(true);
    return false;
  }

  public render() {
    const { project, branches } = this.props;

    if (!project) {
      return <LoadingIcon className={styles.loading} center />;
    }

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

    const { activities, loadActivities, isLoadingActivities, isAllActivitiesRequestedForProject } = this.props;
    const { params: { show } } = this.props;

    if (show === 'all') {
      return (
        <div>
          <ProjectBranches project={project} branches={branches} showAll />
        </div>
      );
    }

    return (
      <div>
        <ProjectSettingsDialog project={project} />
        <ProjectHeader project={project} />
        <ProjectBranches project={project} branches={branches} count={3} />
        <ProjectActivity
          activities={activities!}
          loadActivities={loadActivities.bind(this, project.id)}
          isLoading={isLoadingActivities}
          allLoaded={isAllActivitiesRequestedForProject}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedStateProps => {
  const { projectId } = ownProps.params;
  const project = Projects.selectors.getProject(state, projectId);
  const isLoadingActivities = Requests.selectors.isLoadingActivitiesForProject(state, projectId);
  const isAllActivitiesRequestedForProject = Requests.selectors.isAllActivitiesRequestedForProject(state, projectId);

  if (!project || isFetchError(project)) {
    return {
      project,
      isLoadingActivities,
      isAllActivitiesRequestedForProject,
    };
  }

  let branches: (Branch | FetchError | undefined)[] | undefined | FetchError;
  let branchIDs = project.branches;
  if (branchIDs) {
    if (isFetchError(branchIDs)) {
      branches = branchIDs;
    } else {
      branches = branchIDs.map(branchId => Branches.selectors.getBranch(state, branchId));
    }
  }

  return {
    project,
    isLoadingActivities,
    isAllActivitiesRequestedForProject,
    branches,
    activities: Activities.selectors.getActivitiesForProject(state),
  };
};

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  {
    loadProject: Projects.actions.loadProject,
    loadActivities: Activities.actions.loadActivitiesForProject,
    loadBranches: Branches.actions.loadBranchesForProject,
  },
)(ProjectView);
