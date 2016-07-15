import { applyMiddleware, createStore } from 'redux';
import createLogger = require('redux-logger'); // https://github.com/Microsoft/TypeScript/issues/5565

import rootReducer from '../reducers';

declare var module: { hot: any }; // An ugly hack

export default function configureStore(initialState: Object) {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(createLogger()) // createLogger() must be last
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
