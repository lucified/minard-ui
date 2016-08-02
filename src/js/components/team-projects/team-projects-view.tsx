import * as React from 'react';
import { connect } from 'react-redux';

import Activities, { Activity } from '../../modules/activities';
import Projects, { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

// import ActivitySection from './activity-section';
import ProjectsSection from './projects-section';

interface GeneratedStateProps {
  activities: Activity[];
  projects: Project[];
}

interface GeneratedDispatchProps {
  loadProjects: () => void;
}

class TeamProjectsView extends React.Component<GeneratedStateProps & GeneratedDispatchProps, any> {
  public componentWillMount() {
    this.props.loadProjects();
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

const mapStateToProps = (state: StateTree) => ({
  projects: Projects.selectors.getProjects(state),
  activities: Activities.selectors.getActivities(state),
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, {}>(
  mapStateToProps,
  { loadProjects: Projects.actions.loadProjects }
)(TeamProjectsView);
