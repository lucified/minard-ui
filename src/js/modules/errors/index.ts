import * as actions from './actions';
import reducer from './reducer';
import * as selectors from './selectors';

export default { reducer, selectors, actions };
export { FetchError, ErrorState, isError } from './types';
