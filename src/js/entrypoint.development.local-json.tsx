import { hashHistory } from 'react-router';

import * as api from './api/static-json';
import configureStore from './configure-store.development';
import { startStoreAndRender } from './entrypoint';

startStoreAndRender(configureStore, api, hashHistory);
