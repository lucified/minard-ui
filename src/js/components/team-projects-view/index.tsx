import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

import Activities, { Activity } from '../../modules/activities';
import { FetchError } from '../../modules/errors';
import Projects, { Project } from '../../modules/projects';
import Requests from '../../modules/requests';
import User, { Team } from '../../modules/user';
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
  isAllActivitiesRequested: boolean;
  team?: Team;
}

interface GeneratedDispatchProps {
  loadAllProjects: (teamId: string) => void;
  loadActivities: (teamId: string, count: number, until?: number) => void;
}

type Props = GeneratedStateProps & GeneratedDispatchProps & PassedProps;

class TeamProjectsView extends React.Component<Props, void> {
  constructor(props: Props) {
    super(props);

    this.loadMoreActivities = this.loadMoreActivities.bind(this);
  }

  public componentWillMount() {
    const { loadAllProjects, loadActivities, team } = this.props;

    // TODO: What if team is missing?

    loadAllProjects(team!.id);
    loadActivities(team!.id, 15);
  }

  private loadMoreActivities(count: number, until?: number) {
    const { loadActivities, team } = this.props;

    loadActivities(team!.id, count, until);
  }

  public render() {
    const { activities, projects, params: { show } } = this.props;
    const { isLoadingAllActivities, isLoadingProjects, isAllActivitiesRequested } = this.props;

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
        <ActivitySection
          activities={activities}
          loadActivities={this.loadMoreActivities}
          isLoading={isLoadingAllActivities}
          allLoaded={isAllActivitiesRequested}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree): GeneratedStateProps => ({
  projects: Projects.selectors.getProjects(state),
  activities: Activities.selectors.getActivities(state),
  isLoadingProjects: Requests.selectors.isLoadingAllProjects(state),
  isLoadingAllActivities: Requests.selectors.isLoadingAllActivities(state),
  isAllActivitiesRequested: Requests.selectors.isAllActivitiesRequested(state),
  team: User.selectors.getTeam(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  loadAllProjects: (teamId: string) => { dispatch(Projects.actions.loadAllProjects(teamId)); },
  loadActivities: (teamId: string, count: number, until?: number) => {
    dispatch(Activities.actions.loadActivities(teamId, count, until));
  },
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(TeamProjectsView);
