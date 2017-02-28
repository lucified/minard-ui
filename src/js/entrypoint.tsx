import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Store } from 'redux';

import { Api } from './api/types';
import { update as updateIntercom } from './intercom';
import Selected from './modules/selected';
import routes from './routes';
import sagaCreator from './sagas';

export const createStoreAndRender = (
  configureStore: (initalState: Object, history: any) => Store<any>, // TODO: improve typing
  api: Api,
  history: any, // TODO: improve typing
) => {
  const initialState = {};
  const store = configureStore(initialState, history);
  (store as any).runSaga(sagaCreator(api).root);

  const syncedHistory = syncHistoryWithStore(history, store);

  // Store current open project + branch into state
  syncedHistory.listen((location: any) => { // TODO: better type definition
    // TODO: this is rather fragile and not in the best location. Refactor in some way?
    const result = /^\/project\/([^/]+)(\/branch\/([^/]+))?/.exec(location.pathname);
    const project = (result && result[1]) || null;
    const branch = (result && result[3]) || null;
    const showAll = /\/all$/.exec(location.pathname); // This will break if we have an id that is "all"

    store.dispatch(Selected.actions.setSelected(project, branch, !!showAll));

    // Update Intercom with page changed information
    updateIntercom();
  });

  ReactDOM.render(
    <Provider store={store}>
      <Router history={syncedHistory as any} routes={routes} />
    </Provider>,
    document.getElementById('content'),
  );
};
