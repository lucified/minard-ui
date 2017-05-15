import api from './api';
import configureStore from './configure-store.production';
import { createStoreAndRender } from './entrypoint';

createStoreAndRender(configureStore, api);
