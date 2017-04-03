import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

import Projects from '../modules/projects';
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
  redirectToLogin: () => void;
}

interface GeneratedStateProps {
  isUserLoggedIn: boolean;
  team?: Team;
}

type Props = GeneratedDispatchProps & PassedProps & GeneratedStateProps;

class ProjectsFrame extends React.Component<Props, void> {
  public componentWillMount() {
    const { loadAllProjects, isUserLoggedIn, redirectToLogin, team } = this.props;

    if (!isUserLoggedIn) {
      redirectToLogin();
    } else if (team !== undefined) {
      loadAllProjects(team.id);
    }
  }

  public render() {
    const { children, team } = this.props;

    if (!team) {
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
});

const mapStateToProps = (state: StateTree): GeneratedStateProps => ({
  isUserLoggedIn: User.selectors.isUserLoggedIn(state),
  team: User.selectors.getTeam(state),
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectsFrame);
