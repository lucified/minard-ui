import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Project } from '../../modules/projects';

interface Props {
  project: Project;
}

class ProjectHeader extends React.Component<Props, any> {
  public render() {
    const { project } = this.props;

    return (
      <div className="columns">
        <div className="column col-4">
          <p><strong>{project.name}</strong></p>
        </div>
        <div className="column col-7">
          <p>{project.description}</p>
        </div>
        <div className="column col-1">
          <a className="float-right" href="#"><Icon name="gear" /></a>
        </div>
      </div>
    );
  }
}

export default ProjectHeader;