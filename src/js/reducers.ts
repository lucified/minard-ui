import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import branches, { BranchState } from './modules/branches';
import commits, { CommitState } from './modules/commits';
import projects, { ProjectState } from './modules/projects';

export default combineReducers({
  entities: combineReducers({
    projects: projects.reducer,
    branches: branches.reducer,
    commits: commits.reducer,
  }),
  routing: routerReducer,
});

export interface StateTree {
  entities: {
    branches: BranchState;
    commits: CommitState;
    projects: ProjectState;
  };
  routing: any;
}
