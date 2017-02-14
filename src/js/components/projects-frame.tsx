import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';

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
  redirectTo: (url: string) => void;
}

interface GeneratedStateProps {
  isUserLoggedIn: boolean;
  isLoadingTeamInformation: boolean;
  team?: Team;
}

type Props = GeneratedDispatchProps & PassedProps & GeneratedStateProps;

class ProjectsFrame extends React.Component<Props, any> {
  public componentWillMount() {
    const { loadAllProjects, isUserLoggedIn, redirectTo, team, loadTeamInformation } = this.props;

    if (!isUserLoggedIn) {
      redirectTo('/login');
    } else if (team === undefined) {
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
  redirectTo: (url: string) => { dispatch(push(url)); },
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
