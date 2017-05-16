import * as React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';

// require global styles
require('font-awesome/css/font-awesome.css');
import './styles.scss';

import { update as updateIntercom } from '../intercom';

import DeploymentView from './deployment-view';
import LoginView from './login-view';
import ProjectsFrame from './projects-frame';
import SignupView from './signup-view';
import StreamingAPIHandler from './streaming-api-handler';

const styles = require('./app.scss');

type PassedProps = RouteComponentProps<{}>;

type Props = PassedProps;

const RedirectToTeamProjectsView = () => <Redirect to="/projects" />;

class App extends React.Component<Props, void> {
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

export default App;
