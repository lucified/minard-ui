import * as actions from './actions';
import reducer from './reducer';
import * as selectors from './selectors';

export default { reducer, selectors, actions };
export {
  CreateError,
  DeleteError,
  EditError,
  FetchError,
  FetchCollectionError,
  ErrorState,
  isFetchError
} from './types';
