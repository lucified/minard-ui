import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { History, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Store } from 'redux';

import { Api } from './api/types';
import Selected from './modules/selected';
import routes from './routes';
import sagaCreator from './sagas';

export const startStoreAndRender = (
  configureStore: (initalState: Object) => Store<{}>,
  api: Api,
  history: History.History
) => {
  const initialState = {};
  const store = configureStore(initialState);
  (store as any).runSaga(sagaCreator(api).root);

  const syncedHistory = syncHistoryWithStore(history, store);

  // Store current open project + branch into state
  syncedHistory.listen(location => {
    const result = /^\/project\/([^/]+)(\/([^/]+))?/.exec(location.pathname);
    if (result) {
      const project = result[1] || null;
      const branch = result[3] || null;
      store.dispatch(Selected.actions.setSelected(project, branch));
    }
  });

  ReactDOM.render(
    <Provider store={store}>
      <Router history={syncedHistory} routes={routes} />
    </Provider>,
    document.getElementById('content')
  );
};
