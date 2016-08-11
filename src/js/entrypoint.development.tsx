import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { Api } from './api/types';
import configureStore from './configure-store.development';
import Selected from './modules/selected';
import routes from './routes';
import sagaCreator from './sagas';

const appEntry = (options?: any): void => {
  const api: Api = (options && options.api) || require('./api');
  const initialState = {};
  const store = configureStore(initialState);
  (store as any).runSaga(sagaCreator(api).root);

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
};

appEntry();

export default appEntry;
