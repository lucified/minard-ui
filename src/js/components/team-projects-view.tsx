import * as React from 'react';
import { connect } from 'react-redux';

import projects from '../modules/projects';

import Project from './project';

interface TeamProjectsViewProps {
  projectIDs: string[];
}

const TeamProjectsView = ({ projectIDs }: TeamProjectsViewProps) => (
  <div>
    {projectIDs.map(id => <Project key={id} id={id} />)}
  </div>
);

const mapStateToProps = (state: any) => ({
  projectIDs: projects.selectors.getIDs(state),
});

export default connect(mapStateToProps)(TeamProjectsView);
