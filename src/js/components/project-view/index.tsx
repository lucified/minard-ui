import * as React from 'react';
import { connect } from 'react-redux';

import Activities, { Activity } from '../../modules/activities';
import Branches, { Branch } from '../../modules/branches';
import { FetchError, isError } from '../../modules/errors';
import Loading from '../../modules/loading';
import Projects, { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import LoadingIcon from '../common/loading-icon';
import MinardLink from '../common/minard-link';
import SubHeader from '../common/sub-header';
import ProjectActivity from './project-activity';
import ProjectBranches from './project-branches';
import ProjectHeader from './project-header';

const styles = require('./index.scss');

interface PassedProps {
  params: {
    id: string;
  };
}

interface GeneratedStateProps {
  project?: Project | FetchError;
  branches?: (Branch | FetchError)[];
  activities?: Activity[];
  isLoadingActivities: boolean;
}

interface GeneratedDispatchProps {
  loadProject: (id: string) => void;
  loadActivity: (id: string) => void;
}

class ProjectView extends React.Component<PassedProps & GeneratedStateProps & GeneratedDispatchProps, any> {
  public componentWillMount() {
    const { loadProject, loadActivity } = this.props;
    const { id } = this.props.params;

    loadProject(id);
    loadActivity(id);
  }

  private reloadPage(e: any) {
    e.preventDefault();
    location.reload(true);
    return false;
  }

  public render() {
    const { project } = this.props;

    if (!project) {
      return (
        <div>
          <SubHeader align="left">
            <MinardLink className={styles['sub-header-link']} homepage>‹ Team Lucify</MinardLink>
          </SubHeader>
          <LoadingIcon className={styles.loading} center />
        </div>
      );
    }

    if (isError(project)) {
      return (
        <div className={styles.error}>
          <SubHeader align="left">
            <MinardLink className={styles['sub-header-link']} homepage>‹ Team Lucify</MinardLink>
          </SubHeader>
          <h2>Unable to load project</h2>
          <p><a onClick={this.reloadPage}>Click to reload</a></p>
          <small>{project.prettyError}</small>
        </div>
      );
    }

    const { branches, activities, isLoadingActivities } = this.props;

    return (
      <div>
        <SubHeader align="left">
          <MinardLink className={styles['sub-header-link']} homepage>‹ Team Lucify</MinardLink>
        </SubHeader>
        <ProjectHeader project={project} />
        <ProjectBranches branches={branches!} />
        <ProjectActivity activities={activities!} isLoading={isLoadingActivities} />
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedStateProps => {
  const { id: projectId } = ownProps.params;
  const project = Projects.selectors.getProject(state, projectId);
  const isLoadingActivities = Loading.selectors.isLoadinglActivitiesForProject(state, projectId);

  if (!project || isError(project)) {
    return { project, isLoadingActivities };
  }

  return {
    project,
    isLoadingActivities,
    branches: project.branches.map(branchId => Branches.selectors.getBranch(state, branchId)),
    activities: Activities.selectors.getActivitiesForProject(state),
  };
};

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  {
    loadProject: Projects.actions.loadProject,
    loadActivity: Activities.actions.loadActivitiesForProject,
  },
)(ProjectView);
