import * as React from 'react';
import { IndexRedirect, Route } from 'react-router';

import App from './components/app';
import BranchView from './components/branch-view';
import DeploymentView from './components/deployment-view';
import AuthService from './components/auth-service';
import ProjectView from './components/project-view';
import ProjectsFrame from './components/projects-frame';
import TeamProjectsView from './components/team-projects-view';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="/projects" />
    <Route path="login" component={AuthService}/>
    <Route path="auth-callback" component={AuthService}/>
    <Route component={ProjectsFrame}>
      <Route path="projects(/:show)" component={TeamProjectsView} />
      <Route path="project/:projectId/branch/:branchId" component={BranchView} />
      <Route path="project/:projectId(/:show)" component={ProjectView} />
    </Route>
    <Route path="preview/:commitHash/:deploymentId" component={DeploymentView}>
      <Route path="comment/:commentId" />
      <Route path=":view" />
    </Route>
  </Route>
);
