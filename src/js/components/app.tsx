import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

// require global styles
require('font-awesome/css/font-awesome.css');
import './styles.scss';

import { update as updateIntercom } from '../intercom';
import Requests from '../modules/requests';
import User from '../modules/user';
import { StateTree } from '../reducers';

import Spinner from './common/spinner';
import DeploymentView from './deployment-view';
import Header from './header';
import LoginView from './login-view';
import ProjectsFrame from './projects-frame';
import SignupView from './signup-view';
import StreamingAPIHandler from './streaming-api-handler';

const styles = require('./app.scss');

type PassedProps = RouteComponentProps<{}>;

interface GeneratedStateProps {
  hasStoredUserCredentials: boolean;
  isLoggingIn: boolean;
}

interface GeneratedDispatchProps {
  loadTeamInformation: () => void;
}

type Props = PassedProps & GeneratedDispatchProps & GeneratedStateProps;

interface State {
  loginTriggeredAndNotComplete: boolean;
}

const RedirectToTeamProjectsView = () => <Redirect to="/projects" />;
const ProjectsFrameOrLogin = connect<{ isLoggedIn: boolean; }, {}, RouteComponentProps<{}>>(
  (state) => ({ isLoggedIn: User.selectors.isUserLoggedIn(state) }),
)(({ isLoggedIn, ...props }) => isLoggedIn ? <ProjectsFrame {...props} /> : <Redirect to="/login" />);
const Loading = () => (
  <div>
    <Header />
    <Spinner />
  </div>
);

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { hasStoredUserCredentials, loadTeamInformation } = props;

    if (hasStoredUserCredentials) {
      // NOTE: team information is fetched in three places:
      // - Login View after getting user login information from Auth0
      // - Signup View after getting user information (using the backend's signup endpoint)
      // - Here
      //
      // NOTE 2: componentDidMount might be a better place to call this since if,
      // for some reason, the component does not pass validation and is not mounted,
      // this call will have been made for naught. On the other hand, we want to keep
      // this component's internal state in sync with reality.
      loadTeamInformation();
    }

    this.state = {
      // We need to store this state internally since this.props.isLoggingIn
      // is initially false on the first render.
      loginTriggeredAndNotComplete: props.hasStoredUserCredentials,
    };
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { isLoggingIn } = this.props;
    const { loginTriggeredAndNotComplete } = this.state;

    if (loginTriggeredAndNotComplete && isLoggingIn && !nextProps.isLoggingIn) {
      // Login finished
      this.setState({ loginTriggeredAndNotComplete: false });
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.location !== this.props.location) {
      // Update Intercom with page changed information
      updateIntercom();
    }
  }

  public render() {
    const { loginTriggeredAndNotComplete } = this.state;

    return (
      <div id="minard-app" className={styles.app}>
        <Switch>
          <Route
            path="/preview/:entityType/:id/:token"
            component={loginTriggeredAndNotComplete ? undefined : StreamingAPIHandler}
          />
          <Route component={loginTriggeredAndNotComplete ? undefined : StreamingAPIHandler} />
        </Switch>
        <Switch>
          <Route
            path="/project"
            component={loginTriggeredAndNotComplete ? Loading : ProjectsFrameOrLogin}
          />
          <Route
            path="/projects"
            component={loginTriggeredAndNotComplete ? Loading : ProjectsFrameOrLogin}
          />
          <Route
            path="/preview/:entityType/:id/:token/comment/:commentId"
            component={loginTriggeredAndNotComplete ? undefined : DeploymentView}
          />
          <Route
            path="/preview/:entityType/:id/:token/:view?"
            component={loginTriggeredAndNotComplete ? undefined : DeploymentView}
          />
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
  hasStoredUserCredentials: User.selectors.hasStoredUserCredentials(state),
  isLoggingIn: Requests.selectors.isLoggingIn(state),
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(App);
