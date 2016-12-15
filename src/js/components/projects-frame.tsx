import * as React from 'react';
import { connect } from 'react-redux';

import { teamId } from '../api/team-id';
import { setValue } from '../cookie';
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

  public componentDidMount() {
    // Set a cookie for a week that tells us that the user has access to the main Minard UI.
    // This is used to enable the links in the Deployment View.
    // TODO: Remove this once we have proper user authentication.
    setValue('teamUser', `${teamId}`, 7);
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
