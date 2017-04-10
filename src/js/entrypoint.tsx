import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Store } from 'redux';

import { Api } from './api/types';
import { update as updateIntercom } from './intercom';
import routes from './routes';
import sagaCreator from './sagas';

export const createStoreAndRender = (
  configureStore: (initalState: object, history: any) => Store<any>, // TODO: improve typing
  api: Api,
  history: any, // TODO: improve typing
) => {
  const initialState = {};
  const store = configureStore(initialState, history);
  (store as any).runSaga(sagaCreator(api).root);

  const syncedHistory = syncHistoryWithStore(history, store);

  syncedHistory.listen(() => {
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
