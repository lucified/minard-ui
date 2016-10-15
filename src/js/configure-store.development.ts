import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';

import rootReducer from './reducers';

declare var module: { hot: any }; // An ugly hack
declare var window: { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any };

function configureStore(initialState: Object) {
  const sagaMiddleware = createSagaMiddleware();
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware))
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  (store as any).runSaga = sagaMiddleware.run;
  (store as any).close = () => store.dispatch(END);

  return store;
}

export default configureStore;
