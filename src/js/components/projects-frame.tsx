import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import Projects from '../modules/projects';
import User, { Team } from '../modules/user';
import { StateTree } from '../reducers';

import { logMessage } from '../logger';
import BranchView from './branch-view';
import ErrorDialog from './common/error-dialog';
import Footer from './footer';
import Header from './header';
import ProjectView from './project-view';
import SubHeader from './sub-header';
import TeamProjectsView from './team-projects-view';

interface Params {}

type PassedProps = RouteComponentProps<Params>;

interface GeneratedDispatchProps {
  loadAllProjects: (teamId: string) => void;
}

interface GeneratedStateProps {
  team?: Team;
}

type Props = GeneratedDispatchProps & GeneratedStateProps & PassedProps;

class ProjectsFrame extends React.Component<Props, void> {
  public componentWillMount() {
    const { loadAllProjects, team } = this.props;

    if (team) {
      loadAllProjects(team.id);
    } else {
      console.error('No team information found!');
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { loadAllProjects, team } = nextProps;

    if (team && this.props.team === undefined) {
      loadAllProjects(team.id);
    }
  }

  private redirectToLogin() {
    window.location.href = '/login';
  }

  public render() {
    const { team } = this.props;

    if (!team) {
      // This shouldn't happen.
      logMessage('Inside ProjectsFrame without a team!');

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
          <Route path="/project/:projectId/branch/:branchId" component={BranchView} />
          <Route path="/project/:projectId/:show?" component={ProjectView} />
          <Route path="/projects/:show?" component={TeamProjectsView} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  loadAllProjects: (teamId: string) => { dispatch(Projects.actions.loadAllProjects(teamId)); },
});

const mapStateToProps = (state: StateTree): GeneratedStateProps => ({
  team: User.selectors.getTeam(state),
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectsFrame);
