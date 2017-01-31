import { browserHistory } from 'react-router';

import api from './api/static-json';
import configureStore from './configure-store.development';
import { createStoreAndRender } from './entrypoint';

createStoreAndRender(configureStore, api, browserHistory);
