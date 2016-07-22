import * as React from 'react';
import { IndexRedirect, Route } from 'react-router';

import App from './components/app';
import ProjectView from './components/project/project-view';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="/project" />
    <Route path="project(/:id)" component={ProjectView} />
  </Route>
);
