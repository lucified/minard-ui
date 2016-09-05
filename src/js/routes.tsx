import * as React from 'react';
import { IndexRedirect, Route } from 'react-router';

import App from './components/app';
import BranchView from './components/branch-view';
import ProjectView from './components/project-view';
import TeamProjectsView from './components/team-projects-view';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="/projects" />
    <Route path="projects(/:show)" component={TeamProjectsView} />
    <Route path="project/:projectId" component={ProjectView} />
    <Route path="project/:projectId/:branchId" component={BranchView} />
  </Route>
);
