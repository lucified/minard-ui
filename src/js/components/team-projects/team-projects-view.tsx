import * as React from 'react';
import { connect } from 'react-redux';

import Activities, { Activity } from '../../modules/activities';
import { FetchError } from '../../modules/errors';
import Projects, { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

// import ActivitySection from './activity-section';
import ProjectsSection from './projects-section';

interface GeneratedStateProps {
  activities: Activity[];
  projects: (Project | FetchError)[];
}

interface GeneratedDispatchProps {
  loadAllProjects: () => void;
}

class TeamProjectsView extends React.Component<GeneratedStateProps & GeneratedDispatchProps, any> {
  public componentWillMount() {
    this.props.loadAllProjects();
  }

  public render() {
    const { projects } = this.props;

    return (
      <div>
        <ProjectsSection projects={projects} />
        <div className="divider" />
        {/*<ActivitySection activities={activities} />*/}
      </div>
    );
  }
};

const mapStateToProps = (state: StateTree): GeneratedStateProps => ({
  projects: Projects.selectors.getProjects(state),
  activities: Activities.selectors.getActivities(state),
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, {}>(
  mapStateToProps,
  {
    loadAllProjects: Projects.actions.loadAllProjects,
  }
)(TeamProjectsView);
