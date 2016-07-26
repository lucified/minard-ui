import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import projects, { ProjectState } from './modules/projects';

export default combineReducers({
  entities: combineReducers({
    projects: projects.reducer,
  }),
  routing: routerReducer,
});

export interface StateTree {
  entities: {
    projects: ProjectState;
  };
  routing: any;
}
