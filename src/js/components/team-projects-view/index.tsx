import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';

import Activities, { Activity } from '../../modules/activities';
import { FetchError } from '../../modules/errors';
import Loading from '../../modules/loading';
import Projects, { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import LoadingIcon from '../common/loading-icon';
import SubHeader from '../common/sub-header';
import ActivitySection from './activity-section';
import ProjectsSection from './projects-section';

const styles = require('./index.scss');

interface GeneratedStateProps {
  activities: Activity[];
  projects: (Project | FetchError)[];
  isLoadingProjects: boolean;
  isLoadingAllActivities: boolean;
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
    const { projects, activities, isLoadingAllActivities, isLoadingProjects } = this.props;

    if (isLoadingProjects && projects.length === 0) {
      return (
        <div>
          <SubHeader align="center" />
          <LoadingIcon className={styles.loading} center />
        </div>
      );
    }

    return (
      <div>
        <SubHeader align="center">
          Sort projects by
          <a className={styles['sorting-dropdown']} href="#">Recent <Icon name="caret-down" /></a>
        </SubHeader>
        <ProjectsSection projects={projects} isLoading={isLoadingProjects} />
        <ActivitySection activities={activities} isLoading={isLoadingAllActivities} />
      </div>
    );
  }
};

const mapStateToProps = (state: StateTree): GeneratedStateProps => ({
  projects: Projects.selectors.getProjects(state),
  activities: Activities.selectors.getActivities(state),
  isLoadingProjects: Loading.selectors.isLoadingAllProjects(state),
  isLoadingAllActivities: Loading.selectors.isLoadingAllActivities(state),
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, {}>(
  mapStateToProps,
  {
    loadAllProjects: Projects.actions.loadAllProjects,
    loadActivities: Activities.actions.loadActivities,
  }
)(TeamProjectsView);
