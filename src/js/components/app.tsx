import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

// require global styles
require('font-awesome/css/font-awesome.css');
import './styles.scss';

import Projects from '../modules/projects';

import Footer from './footer';
import Header from './header';
import StreamingAPIHandler from './streaming-api-handler';
import SubHeader from './sub-header';

const styles = require('./app.scss');

interface PassedProps {
  location: any;
  route: any;
  params: any;
}

interface GeneratedDispatchProps {
  loadAllProjects: () => void;
}

class App extends React.Component<PassedProps & GeneratedDispatchProps, any> {
  public componentWillMount() {
    this.props.loadAllProjects();

    const intercom = (window as any).Intercom;
    if (intercom) {
      intercom('boot', {
        app_id: 'i2twhziy',
        user_id: 'user1', // TODO: add proper user_id and user_email once known
      });
    }
  }

  public render() {
    const { children } = this.props;

    return (
      <div id="minard-app" className={classNames(styles.app)}>
        <StreamingAPIHandler />
        <Header />
        <SubHeader />
        {children}
        <Footer />
      </div>
    );
  }
};

export default connect<{}, GeneratedDispatchProps, PassedProps>(
  () => ({}),
  { loadAllProjects: Projects.actions.loadAllProjects }
)(App);
