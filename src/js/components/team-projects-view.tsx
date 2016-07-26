import * as React from 'react';
import { connect } from 'react-redux';

import projects, { Project } from '../modules/projects';

import ProjectSummary from './project-summary';

interface Props {
  projects: Project[];
}

const TeamProjectsView = ({ projects }: Props) => (
  <div>
    {projects.map(project => <ProjectSummary key={project.id} project={project} />)}
  </div>
);

const mapStateToProps = (state: any) => ({
  projects: projects.selectors.getProjects(state),
});

export default connect(mapStateToProps)(TeamProjectsView);
