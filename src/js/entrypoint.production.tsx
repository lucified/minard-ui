import { browserHistory } from 'react-router';

import * as api from './api';
import configureStore from './configure-store.production';
import { startStoreAndRender } from './entrypoint';

startStoreAndRender(configureStore, api, browserHistory);
