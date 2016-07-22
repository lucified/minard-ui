import { routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import createLogger = require('redux-logger'); // https://github.com/Microsoft/TypeScript/issues/5565

//import rootReducer from './reducers';

declare var module: { hot: any }; // An ugly hack

function configureStore(initialState: Object) {
  const store = createStore(
    combineReducers({
      // TODO: add reducers here
      routing: routerReducer,
    }),
    initialState,
    // TODO: remove logger for production
    applyMiddleware(createLogger()) // createLogger() must be last
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

export default configureStore;
