import * as React from 'react';
import { Route, Router } from 'react-router';
import * as ReactRouterRedux from 'react-router-redux';

import App from './components/app';

interface Props {
  history: ReactRouterRedux.ReactRouterReduxHistory;
}

export default (props: Props) => {
  return (
    <Router history={props.history}>
      <Route path="/" component={App} />
    </Router>
  );
};
