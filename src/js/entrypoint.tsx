import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import * as api from './api';
import configureStore from './configure-store';
import routes from './routes';
import sagaCreator from './sagas';

require('es6-promise').polyfill();

const initialState = {};
const store = configureStore(initialState);
(store as any).runSaga(sagaCreator(api).root);

// hashHistory should be changed to browserHistory in production
const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('content')
);
