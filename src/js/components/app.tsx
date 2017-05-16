import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

// require global styles
require('font-awesome/css/font-awesome.css');
import './styles.scss';

import { update as updateIntercom } from '../intercom';
import User from '../modules/user';
import { StateTree } from '../reducers';

import DeploymentView from './deployment-view';
import LoginView from './login-view';
import ProjectsFrame from './projects-frame';
import SignupView from './signup-view';
import StreamingAPIHandler from './streaming-api-handler';

const styles = require('./app.scss');

type PassedProps = RouteComponentProps<{}>;

interface GeneratedStateProps {
  isUserLoggedIn: boolean;
}

interface GeneratedDispatchProps {
  loadTeamInformation: () => void;
}

type Props = PassedProps & GeneratedDispatchProps & GeneratedStateProps;

const RedirectToTeamProjectsView = () => <Redirect to="/projects" />;

class App extends React.Component<Props, void> {
  public componentWillMount() {
    const { isUserLoggedIn, loadTeamInformation } = this.props;

    if (isUserLoggedIn) {
      // TODO: team information is now being fetched in three places:
      // - Login View after getting user login information from Auth0
      // - Signup View after getting user information (using the backend's signup endpoint)
      // - Here
      //
      // We should probably try to reduce the number of places.
      loadTeamInformation();
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.location !== this.props.location) {
      // Update Intercom with page changed information
      updateIntercom();
    }
  }

  public render() {
    return (
      <div id="minard-app" className={styles.app}>
        <Switch>
          <Route path="/preview/:entityType/:id/:token" component={StreamingAPIHandler} />
          <Route component={StreamingAPIHandler} />
        </Switch>
        <Switch>
          <Route path="/project" component={ProjectsFrame} />
          <Route path="/projects" component={ProjectsFrame} />
          <Route path="/preview/:entityType/:id/:token/comment/:commentId" component={DeploymentView} />
          <Route path="/preview/:entityType/:id/:token/:view?" component={DeploymentView} />
          <Route path="/login/:returnPath?" component={LoginView} />
          <Route path="/signup/:teamToken?" component={SignupView} />
          <Route component={RedirectToTeamProjectsView} />
        </Switch>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  loadTeamInformation: () => { dispatch(User.actions.loadTeamInformation()); },
});

const mapStateToProps = (state: StateTree): GeneratedStateProps => ({
  isUserLoggedIn: User.selectors.isUserLoggedIn(state),
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(App);
