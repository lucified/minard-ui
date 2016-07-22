import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Routes from './routes';
import configureStore from './configure-store';

const initialState = {};
const store = configureStore(initialState);
// hashHistory should be changed to browserHistory in production
const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Routes history={history} />
  </Provider>,
  document.getElementById('content')
);
