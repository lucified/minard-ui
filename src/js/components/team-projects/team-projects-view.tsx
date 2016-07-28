import * as React from 'react';
import { connect } from 'react-redux';

import activity, { Activity } from '../../modules/activity';
import projects, { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import ActivitySection from './activity-section';
import ProjectsSection from './projects-section';

interface Props {
  activities: Activity[];
  projects: Project[];
}

const TeamProjectsView = ({ projects, activities }: Props) => (
  <div>
    <ProjectsSection projects={projects} />
    <div className="divider" />
    <ActivitySection activities={activities} />
  </div>
);

const mapStateToProps = (state: StateTree) => ({
  projects: projects.selectors.getProjects(state),
  activities: activity.selectors.getActivities(state),
});

export default connect(mapStateToProps)(TeamProjectsView);
