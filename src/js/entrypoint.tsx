import { History } from 'history';
import createHistory from 'history/createBrowserHistory';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Store } from 'redux';

import { Api } from './api/types';
import App from './components/app';
import sagaCreator from './sagas';

export const createStoreAndRender = (
  configureStore: (initalState: object, history: History) => Store<any>,
  api: Api,
) => {
  const initialState = {};
  const history = createHistory();
  const store = configureStore(initialState, history);
  (store as any).runSaga(sagaCreator(api));

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Route component={App} />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('content'),
  );
};
