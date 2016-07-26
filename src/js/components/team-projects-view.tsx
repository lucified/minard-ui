import * as React from 'react';
import { connect } from 'react-redux';

import projects, { Project } from '../modules/projects';
import { StateTree } from '../reducers';

import ProjectSummary from './project-summary';

interface Props {
  projects: Project[];
}

const TeamProjectsView = ({ projects }: Props) => (
  <div>
    {projects.map(project => <ProjectSummary key={project.id} project={project} />)}
  </div>
);

const mapStateToProps = (state: StateTree) => ({
  projects: projects.selectors.getProjects(state),
});

export default connect(mapStateToProps)(TeamProjectsView);
