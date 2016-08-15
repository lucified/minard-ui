import { hashHistory } from 'react-router';

import * as api from './api/static-json';
import configureStore from './configure-store.development';
import { createStoreAndRender } from './entrypoint';

createStoreAndRender(configureStore, api, hashHistory);
