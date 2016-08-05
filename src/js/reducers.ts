import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import Activities, { ActivityState } from './modules/activities';
import Branches, { BranchState } from './modules/branches';
import Commits, { CommitState } from './modules/commits';
import Deployments, { DeploymentState } from './modules/deployments';
import Projects, { ProjectState } from './modules/projects';

export default combineReducers({
  entities: combineReducers({
    activities: Activities.reducer,
    branches: Branches.reducer,
    commits: Commits.reducer,
    projects: Projects.reducer,
    deployments: Deployments.reducer,
  }),
  routing: routerReducer,
});

export interface StateTree {
  entities: {
    activities: ActivityState;
    branches: BranchState;
    commits: CommitState;
    projects: ProjectState;
    deployments: DeploymentState;
  };
  routing: any;
}
