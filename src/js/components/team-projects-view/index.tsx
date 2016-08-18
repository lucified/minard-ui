import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';

import Activities, { Activity } from '../../modules/activities';
import { FetchError } from '../../modules/errors';
import Projects, { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import SubHeader from '../common/sub-header';
import ActivitySection from './activity-section';
import ProjectsSection from './projects-section';

const styles = require('./index.scss');

interface GeneratedStateProps {
  activities: Activity[];
  projects: (Project | FetchError)[];
}

interface GeneratedDispatchProps {
  loadAllProjects: () => void;
  loadActivities: () => void;
}

class TeamProjectsView extends React.Component<GeneratedStateProps & GeneratedDispatchProps, any> {
  public componentWillMount() {
    const { loadAllProjects, loadActivities } = this.props;

    loadAllProjects();
    loadActivities();
  }

  public render() {
    const { projects, activities } = this.props;

    return (
      <div>
        <SubHeader align="center">
          Sort projects by
          <a className={styles['sorting-dropdown']} href="#">Recent <Icon name="caret-down" /></a>
        </SubHeader>
        <ProjectsSection projects={projects} />
        <ActivitySection activities={activities} />
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
    loadActivities: Activities.actions.loadActivities,
  }
)(TeamProjectsView);
