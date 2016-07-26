import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import branches, { BranchState } from './modules/branches';
import projects, { ProjectState } from './modules/projects';

export default combineReducers({
  entities: combineReducers({
    projects: projects.reducer,
    branches: branches.reducer,
  }),
  routing: routerReducer,
});

export interface StateTree {
  entities: {
    projects: ProjectState;
    branches: BranchState;
  };
  routing: any;
}
