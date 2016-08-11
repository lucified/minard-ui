import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import * as api from './api';
import configureStore from './configure-store';
import Selected from './modules/selected';
import routes from './routes';
import sagaCreator from './sagas';

require('es6-promise').polyfill();

const initialState = {};
const store = configureStore(initialState);
(store as any).runSaga(sagaCreator(api).root);

// TODO: hashHistory should be changed to browserHistory in production
const history = syncHistoryWithStore(hashHistory, store);

// Store current open project + branch into state
history.listen(location => {
  const result = /^\/project\/([^/]+)(\/([^/]+))?/.exec(location.pathname);
  if (result) {
    const project = result[1] || null;
    const branch = result[3] || null;
    store.dispatch(Selected.actions.setSelected(project, branch));
  }
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('content')
);
