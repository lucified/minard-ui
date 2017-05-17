import { routerReducer, RouterState } from 'react-router-redux';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import Activities, { ActivityState } from './modules/activities';
import Branches, { BranchState } from './modules/branches';
import Comments, { CommentState } from './modules/comments';
import Commits, { CommitState } from './modules/commits';
import Deployments, { DeploymentState } from './modules/deployments';
import Errors, { ErrorState } from './modules/errors';
import Modal, { ModalState } from './modules/modal';
import Previews, { PreviewState } from './modules/previews';
import Projects, { ProjectState } from './modules/projects';
import Requests, { RequestsState } from './modules/requests';
import Selected, { SelectedState } from './modules/selected';
import Streaming, { StreamingState } from './modules/streaming';
import User, { UserState } from './modules/user';

export default combineReducers({
  entities: combineReducers({
    activities: Activities.reducer,
    branches: Branches.reducer,
    comments: Comments.reducer,
    commits: Commits.reducer,
    deployments: Deployments.reducer,
    previews: Previews.reducer,
    projects: Projects.reducer,
  }),
  errors: Errors.reducer,
  requests: Requests.reducer,
  selected: Selected.reducer,
  modal: Modal.reducer,
  streaming: Streaming.reducer,
  user: User.reducer,
  form: formReducer,
  routing: routerReducer,
});

export interface StateTree {
  entities: {
    activities: ActivityState;
    branches: BranchState;
    comments: CommentState;
    commits: CommitState;
    deployments: DeploymentState;
    previews: PreviewState;
    projects: ProjectState;
  };
  errors: ErrorState;
  requests: RequestsState;
  selected: SelectedState;
  modal: ModalState;
  streaming: StreamingState;
  user: UserState;
  form: any;
  routing: RouterState;
}
