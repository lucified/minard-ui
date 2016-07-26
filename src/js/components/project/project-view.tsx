import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';

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

interface GeneratedProps {
  project?: Project;
  branches?: Branch[];
}

class ProjectView extends React.Component<PassedProps & GeneratedProps, any> {
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

    const { branches } = this.props;

    return (
      <div>
        <ProjectHeader project={project} />
        <div className="divider" />
        <ProjectBranches branches={branches} />
        <div className="divider" />
        <ProjectActivity project={project} />
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree, ownProps: PassedProps) => ({
  project: projects.selectors.getProject(state, ownProps.params.id),
  branches: projects.selectors.getBranches(state, ownProps.params.id)
    .map(branchId => branches.selectors.getBranch(state, branchId)),
});

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(ProjectView);
