import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

import Projects from '../modules/projects';
import Requests from '../modules/requests';
import User, { Team } from '../modules/user';
import { StateTree } from '../reducers';

import Footer from './footer';
import Header from './header';
import SubHeader from './sub-header';

interface PassedProps {
  location: any;
  route: any;
  params: any;
}

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

type Props = GeneratedDispatchProps & PassedProps & GeneratedStateProps;

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

  public render() {
    const { children, team, isLoadingTeamInformation } = this.props;

    if (!team) {
      if (isLoadingTeamInformation) {
        // TODO: better loading indicator
        return <div>Loading...</div>;
      }

      // TODO: better error indicator
      return <div>Unable to load team information</div>;
    }

    return (
      <div>
        <Header />
        <SubHeader />
        {children}
        <Footer />
      </div>
    );
  }
};

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
