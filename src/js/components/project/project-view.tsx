import * as React from 'react';

import ProjectActivity from './project-activity';
import ProjectBranches from './project-branches';
import ProjectHeader from './project-header';

const Icon = require('react-fontawesome');

interface ProjectViewProps extends React.Props<ProjectView> {
  id?: string;
}

class ProjectView extends React.Component<ProjectViewProps, any> {
  public render() {
    const { id } = this.props;

    if (!id) {
      return (
        <div className="empty">
          <Icon name="circle-o-notch" spin fixedWidth size="3x" />
          <p className="empty-title">Loading project</p>
          <p className="empty-meta">We'll be right with you!</p>
        </div>
      );
    }

    return (
      <div>
        <ProjectHeader />
        <ProjectBranches />
        <ProjectActivity />
      </div>
    );
  }
}

export default ProjectView;
