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

export const createStoreAndRender = (
  configureStore: (initalState: Object) => Store<any>,
  api: Api,
  history: any // TODO: fix (to History.History?) once type definitions fixed in react-router-redux
) => {
  const initialState = {};
  const store = configureStore(initialState);
  (store as any).runSaga(sagaCreator(api).root);

  const syncedHistory = syncHistoryWithStore(history, store);

  // Store current open project + branch into state
  syncedHistory.listen((location: History.Location) => {
    const result = /^\/project\/([^/]+)(\/([^/]+))?/.exec(location.pathname);
    const project = (result && result[1]) || null;
    const branch = (result && result[3]) || null;
    const showAll = /\/all$/.exec(location.pathname); // This will break if we have an id that is "all"

    store.dispatch(Selected.actions.setSelected(project, branch, !!showAll));
  });

  ReactDOM.render(
    <Provider store={store}>
      <Router history={syncedHistory} routes={routes} />
    </Provider>,
    document.getElementById('content')
  );
};
