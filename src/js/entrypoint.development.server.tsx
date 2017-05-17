import api from './api';
import configureStore from './configure-store.development';
import { createStoreAndRender } from './entrypoint';

createStoreAndRender(configureStore, api);
