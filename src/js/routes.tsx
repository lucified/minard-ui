import * as React from 'react';
import { IndexRedirect, Route } from 'react-router';

import App from './components/app';
import ProjectView from './components/project/project-view';
import TeamProjectsView from './components/team-projects-view';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="/projects" />
    <Route path="projects" component={TeamProjectsView} />
    <Route path="project/:id" component={ProjectView} />
  </Route>
);
