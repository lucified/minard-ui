import * as React from 'react';
import { connect } from 'react-redux';

import activity, { Activity } from '../../modules/activity';
import projects, { Project } from '../../modules/projects';
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
  projects: projects.selectors.getProjects(state),
  activities: activity.selectors.getActivities(state),
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, {}>(
  mapStateToProps,
  { loadProjects: projects.actions.loadProjects }
)(TeamProjectsView);
