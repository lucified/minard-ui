import * as React from 'react';
import { connect } from 'react-redux';

import Projects from '../modules/projects';

import Footer from './footer';
import Header from './header';
import SubHeader from './sub-header';

interface PassedProps {
  location: any;
  route: any;
  params: any;
}

interface GeneratedDispatchProps {
  loadAllProjects: () => void;
}

class ProjectsFrame extends React.Component<PassedProps & GeneratedDispatchProps, any> {
  public componentWillMount() {
    this.props.loadAllProjects();
  }

  public render() {
    const { children } = this.props;

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

export default connect<{}, GeneratedDispatchProps, PassedProps>(
  () => ({}),
  { loadAllProjects: Projects.actions.loadAllProjects },
)(ProjectsFrame);
