import * as actions from './actions';
import reducer from './reducer';
import createSagas from './sagas';
import * as selectors from './selectors';

export default { actions, reducer, selectors, createSagas };
export {
  Deployment,
  DeploymentState,
  DeploymentStatus,
  isSuccessful,
  isFailed,
  isPending,
  StoreDeploymentsAction,
  toDeploymentStatus,
} from './types';
