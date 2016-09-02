import * as actions from './actions';
import reducer from './reducer';
import * as selectors from './selectors';

export default { reducer, selectors, actions };
export { CreateError, EditError, FetchError, ErrorState, isError } from './types';
