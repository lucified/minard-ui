import { compact } from 'lodash';
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';

import activity, { Activity } from '../../modules/activity';
import branches, { Branch } from '../../modules/branches';
import projects, { Project } from '../../modules/projects';
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
  project: Project;
  branches: Branch[];
  activities: Activity[];
}

interface GeneratedDispatchProps {
  loadProject: (id: string) => void;
}

class ProjectView extends React.Component<PassedProps & GeneratedStateProps & GeneratedDispatchProps, any> {
  public componentWillMount() {
    this.props.loadProject(this.props.params.id);
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

const mapStateToProps = (state: StateTree, ownProps: PassedProps) => {
  const { id: projectId } = ownProps.params;
  const project = projects.selectors.getProject(state, projectId);

  return {
    project,
    branches: project && compact(project.branches.map(branchId => branches.selectors.getBranch(state, branchId))),
    activities: activity.selectors.getActivityForProject(state, projectId),
  };
};

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  { loadProject: projects.actions.loadProject },
)(ProjectView);
