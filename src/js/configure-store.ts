import { applyMiddleware, compose, createStore } from 'redux';
import createLogger = require('redux-logger'); // https://github.com/Microsoft/TypeScript/issues/5565
import createSagaMiddleware, { END } from 'redux-saga';

import rootReducer from './reducers';

declare var module: { hot: any }; // An ugly hack
declare var window: { devToolsExtension: any };

function configureStore(initialState: Object) {
  // create the saga middleware
  const sagaMiddleware = createSagaMiddleware();
  const loggerMiddleware = createLogger();

  const store = createStore(
    rootReducer,
    initialState,
    // TODO: remove logger for production
    compose(
      applyMiddleware(
        sagaMiddleware,
        loggerMiddleware, // logggerMiddleware must be last
      ),
      window.devToolsExtension ? window.devToolsExtension() : (f: any) => f
    )
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
