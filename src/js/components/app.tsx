import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

// require global styles
require('font-awesome/css/font-awesome.css');
import './styles.scss';

import Modal from '../modules/modal';
import Projects from '../modules/projects';
import { StateTree } from '../reducers';

import Footer from './footer';
import Header from './header';
import SubHeader from './sub-header';

const styles = require('./app.scss');

interface PassedProps {
  location: any;
  route: any;
  params: any;
}

interface GeneratedStateProps {
  isModalOpen: boolean;
}

interface GeneratedDispatchProps {
  loadAllProjects: () => void;
}

class App extends React.Component<PassedProps & GeneratedStateProps & GeneratedDispatchProps, any> {
  public componentWillMount() {
    this.props.loadAllProjects();
  }

  public render() {
    const { isModalOpen, children } = this.props;

    return (
      <div className={classNames(styles.app, { [styles['modal-open']]: isModalOpen })}>
        <Header />
        <SubHeader />
        {children}
        <Footer />
      </div>
    );
  }
};

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  (state: StateTree) => ({ isModalOpen: Modal.selectors.isModalOpen(state) }),
  { loadAllProjects: Projects.actions.loadAllProjects }
)(App);
