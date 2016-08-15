import { hashHistory } from 'react-router';

import * as api from './api';
import configureStore from './configure-store.development';
import { startStoreAndRender } from './entrypoint';

startStoreAndRender(configureStore, api, hashHistory);
