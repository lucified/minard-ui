import * as actions from './actions';
import reducer from './reducer';
import * as selectors from './selectors';

export default { actions, reducer, selectors };
export {
  CollectionActionCreators,
  CreateEntityActionCreators,
  DeleteEntityActionCreators,
  EditEntityActionCreators,
  EntityRequestAction,
  EntitySuccessAction,
  FetchEntityActionCreators,
  RequestInformation,
  RequestsState,
} from './types';
