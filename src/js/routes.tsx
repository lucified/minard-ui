import * as React from 'react';
import { IndexRedirect, Route } from 'react-router';

import App from './components/app';
import BranchView from './components/branch-view';
import DeploymentView from './components/deployment-view';
import LoginView from './components/login-view';
import ProjectView from './components/project-view';
import ProjectsFrame from './components/projects-frame';
import SignupView from './components/signup-view';
import TeamProjectsView from './components/team-projects-view';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="/projects" />
    <Route component={ProjectsFrame}>
      <Route path="projects(/:show)" component={TeamProjectsView} />
      <Route path="project/:projectId/branch/:branchId" component={BranchView} />
      <Route path="project/:projectId(/:show)" component={ProjectView} />
    </Route>
    <Route path="preview/:entityType/:id/:token" component={DeploymentView}>
      <Route path="comment/:commentId" />
      <Route path=":view" />
    </Route>
    <Route path="login(/:returnPath)" component={LoginView} />
    <Route path="signup(/:teamToken)" component={SignupView} />
  </Route>
);
