import * as actions from './actions';
import reducer from './reducer';
import * as selectors from './selectors';

export default { actions, reducer, selectors };
export {
  Activity,
  ActivityState,
  ActivityType,
  LoadActivitiesAction,
  LoadActivitiesForProjectAction,
} from './types';
