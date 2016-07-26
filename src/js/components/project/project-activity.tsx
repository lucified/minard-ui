import * as React from 'react';

import { Project } from '../../modules/projects';

interface Props {
  project: Project;
}

class ProjectActivity extends React.Component<Props, any> {
  public render() {
    return (
      <div>
        <div className="columns">
          <div className="column col-12">
            <h4>Activity</h4>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectActivity;
