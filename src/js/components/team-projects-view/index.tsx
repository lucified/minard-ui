import * as React from 'react';
import { connect } from 'react-redux';

import Activities, { Activity } from '../../modules/activities';
import { FetchError } from '../../modules/errors';
import Projects, { Project } from '../../modules/projects';
import Requests from '../../modules/requests';
import { StateTree } from '../../reducers';

import LoadingIcon from '../common/loading-icon';
import ActivitySection from './activity-section';
import ProjectsSection from './projects-section';

const styles = require('./index.scss');

interface PassedProps {
  params: {
    show?: string;
  };
}

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

class TeamProjectsView extends React.Component<GeneratedStateProps & GeneratedDispatchProps & PassedProps, any> {
  public componentWillMount() {
    const { loadAllProjects, loadActivities } = this.props;

    loadAllProjects();
    //loadActivities();
  }

  public render() {
    const { projects, activities, isLoadingAllActivities, isLoadingProjects, params: { show } } = this.props;

    if (isLoadingProjects && projects.length === 0) {
      return <LoadingIcon className={styles.loading} center />;
    }

    if (show === 'all') {
      return (
        <ProjectsSection projects={projects} isLoading={isLoadingProjects} showAll />
      );
    }

    return (
      <div>
        <ProjectsSection projects={projects} isLoading={isLoadingProjects} count={6} />
        {/*<ActivitySection activities={activities} isLoading={isLoadingAllActivities} />*/}
      </div>
    );
  }
};

const mapStateToProps = (state: StateTree): GeneratedStateProps => ({
  projects: Projects.selectors.getProjects(state),
  activities: Activities.selectors.getActivities(state),
  isLoadingProjects: Requests.selectors.isLoadingAllProjects(state),
  isLoadingAllActivities: Requests.selectors.isLoadingAllActivities(state),
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  {
    loadAllProjects: Projects.actions.loadAllProjects,
    loadActivities: Activities.actions.loadActivities,
  }
)(TeamProjectsView);
