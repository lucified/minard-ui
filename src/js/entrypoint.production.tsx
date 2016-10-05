import * as Raven from 'raven-js';
import { browserHistory } from 'react-router';

import api from './api';
import configureStore from './configure-store.production';
import { createStoreAndRender } from './entrypoint';

Raven.config('https://5e38eb7e669d4806a4696cb72d6a275c@sentry.io/103814',
  {
    environment: process.env.ENV,
    release: process.env.VERSION,
  }
).install();

createStoreAndRender(configureStore, api, browserHistory);
