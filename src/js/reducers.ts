import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import Activities, { ActivityState } from './modules/activities';
import Branches, { BranchState } from './modules/branches';
import Commits, { CommitState } from './modules/commits';
import Deployments, { DeploymentState } from './modules/deployments';
import Errors, { ErrorState } from './modules/errors';
import Loading, { LoadingState } from './modules/loading';
import Modal, { ModalState } from './modules/modal';
import Projects, { ProjectState } from './modules/projects';
import Selected, { SelectedState } from './modules/selected';

export default combineReducers({
  entities: combineReducers({
    activities: Activities.reducer,
    branches: Branches.reducer,
    commits: Commits.reducer,
    projects: Projects.reducer,
    deployments: Deployments.reducer,
  }),
  errors: Errors.reducer,
  loading: Loading.reducer,
  selected: Selected.reducer,
  modal: Modal.reducer,
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
  errors: ErrorState;
  loading: LoadingState;
  selected: SelectedState;
  modal: ModalState;
  routing: any;
}
