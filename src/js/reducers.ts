import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import projects from './modules/projects';

export default combineReducers({
  entities: combineReducers({
    projects: projects.reducer,
  }),
  routing: routerReducer,
});
