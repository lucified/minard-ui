import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import activity, { ActivityState } from './modules/activity';
import branches, { BranchState } from './modules/branches';
import commits, { CommitState } from './modules/commits';
import projects, { ProjectState } from './modules/projects';

export default combineReducers({
  entities: combineReducers({
    activities: activity.reducer,
    branches: branches.reducer,
    commits: commits.reducer,
    projects: projects.reducer,
  }),
  routing: routerReducer,
});

export interface StateTree {
  entities: {
    activities: ActivityState;
    branches: BranchState;
    commits: CommitState;
    projects: ProjectState;
  };
  routing: any;
}
