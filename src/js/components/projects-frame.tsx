import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router';

import Projects from '../modules/projects';
import Requests from '../modules/requests';
import User, { Team } from '../modules/user';
import { StateTree } from '../reducers';

import BranchView from './branch-view';
import ErrorDialog from './common/error-dialog';
import Spinner from './common/spinner';
import Footer from './footer';
import Header from './header';
import ProjectView from './project-view';
import SubHeader from './sub-header';
import TeamProjectsView from './team-projects-view';

interface Params {}

type PassedProps = RouteComponentProps<Params>;

interface GeneratedDispatchProps {
  loadAllProjects: (teamId: string) => void;
  loadTeamInformation: () => void;
  redirectToLogin: () => void;
}

interface GeneratedStateProps {
  isUserLoggedIn: boolean;
  isLoadingTeamInformation: boolean;
  team?: Team;
}

type Props = GeneratedDispatchProps & GeneratedStateProps & PassedProps;

class ProjectsFrame extends React.Component<Props, void> {
  public componentWillMount() {
    const { loadAllProjects, isUserLoggedIn, redirectToLogin, team, loadTeamInformation } = this.props;

    if (!isUserLoggedIn) {
      redirectToLogin();
    } else if (team === undefined) {
      // TODO: team information is now being fetched in three places:
      // - Login View after getting user login information from Auth0
      // - Signup View after getting user information (using the backend's signup endpoint)
      // - Here
      //
      // We should probably try to reduce the number of places.
      loadTeamInformation();
    } else {
      loadAllProjects(team.id);
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { loadAllProjects, team } = this.props;

    if (nextProps.team && team === undefined) {
      loadAllProjects(nextProps.team.id);
    }
  }

  private redirectToLogin() {
    window.location.href = '/login';
  }

  public render() {
    const { team, isLoadingTeamInformation } = this.props;

    if (!team) {
      if (isLoadingTeamInformation) {
        return (
          <div>
            <Header />
            <Spinner />
          </div>
        );
      }

      return (
        <div>
          <Header />
          <ErrorDialog title="Error" actionText="Log in" action={this.redirectToLogin}>
            <p>
              Unable to load Minard. If this problem persists,
              contact <a href="mailto:support@minard.io">support@minard.io</a>.
            </p>
          </ErrorDialog>
        </div>
      );
    }

    return (
      <div>
        <Header />
        <SubHeader />
        <Switch>
          <Route path=":projectId/branch/:branchId" component={BranchView} />
          <Route path=":projectId(/:show)" component={ProjectView} />
          <Route path="(:show)" component={TeamProjectsView} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  loadAllProjects: (teamId: string) => { dispatch(Projects.actions.loadAllProjects(teamId)); },
  redirectToLogin: () => { dispatch(User.actions.redirectToLogin()); },
  loadTeamInformation: () => { dispatch(User.actions.loadTeamInformation()); },
});

const mapStateToProps = (state: StateTree): GeneratedStateProps => ({
  isUserLoggedIn: User.selectors.isUserLoggedIn(state),
  isLoadingTeamInformation: Requests.selectors.isLoadingTeamInformation(state),
  team: User.selectors.getTeam(state),
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectsFrame);
