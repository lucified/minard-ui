import * as actions from './actions';
import reducer from './reducer';
import * as selectors from './selectors';

export default { actions, reducer, selectors };
export {
  Deployment,
  DeploymentState,
  DeploymentStatus,
  DeploymentStatusString,
  isSuccessful,
  isFailed,
  isPending,
  toDeploymentStatus,
} from './types';
