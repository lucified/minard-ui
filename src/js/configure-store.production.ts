import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';

// TODO: change to import once typings exist
const RavenMiddleware = require('redux-raven-middleware');

import rootReducer from './reducers';

function configureStore(initialState: Object, history: any) { // TODO: improve typings
  const sagaMiddleware = createSagaMiddleware();
  const routerMiddlewareObject = routerMiddleware(history);

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      // The RavenMiddleware also starts reporting all unhandled exceptions
      RavenMiddleware(
        'https://5e38eb7e669d4806a4696cb72d6a275c@sentry.io/103814',
        {
          environment: process.env.ENV,
          release: process.env.VERSION,
        },
      ),
      sagaMiddleware,
      routerMiddlewareObject,
    ),
  );

  (store as any).runSaga = sagaMiddleware.run;
  (store as any).close = () => store.dispatch(END);

  return store;
}

export default configureStore;
