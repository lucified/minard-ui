import { History } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';

import rootReducer from './reducers';

declare const module: { hot: any }; // An ugly hack
declare const window: { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any };

function configureStore(initialState: object, history: History) {
  const sagaMiddleware = createSagaMiddleware();
  const routerMiddlewareObject = routerMiddleware(history);
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware, routerMiddlewareObject)),
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
