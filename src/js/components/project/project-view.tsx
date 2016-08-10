import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';

import Activities, { Activity } from '../../modules/activities';
import Branches, { Branch } from '../../modules/branches';
import { FetchError, isError } from '../../modules/errors';
import Projects, { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import ProjectActivity from './project-activity';
import ProjectBranches from './project-branches';
import ProjectHeader from './project-header';

interface PassedProps {
  params: {
    id: string;
  };
}

interface GeneratedStateProps {
  project?: Project | FetchError;
  branches?: (Branch | FetchError)[];
  activities?: Activity[];
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

  public render() {
    const { project } = this.props;

    if (!project) {
      return (
        <div className="empty">
          <Icon name="circle-o-notch" spin fixedWidth size="3x" />
          <p className="empty-title">Loading project</p>
          <p className="empty-meta">We'll be right with you!</p>
        </div>
      );
    }

    if (isError(project)) {
      return (
        <div className="empty">
          <Icon name="exclamation" fixedWidth size="3x" />
          <p className="empty-title">Error loading project</p>
          <p className="empty-meta">{project.prettyError}</p>
        </div>
      );
    }

    const { branches, activities } = this.props;

    return (
      <div>
        <ProjectHeader project={project} />
        <div className="divider" />
        <ProjectBranches branches={branches} />
        <div className="divider" />
        <ProjectActivity activities={activities} />
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedStateProps => {
  const { id: projectId } = ownProps.params;
  const project = Projects.selectors.getProject(state, projectId);

  if (!project || isError(project)) {
    return { project };
  }

  return {
    project,
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
