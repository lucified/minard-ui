import * as actions from './actions';
import reducer from './reducer';
import createSagas from './sagas';
import * as selectors from './selectors';

export default { actions, reducer, selectors, createSagas };
export {
  Comment,
  CommentState,
  CreateCommentAction,
  CreateCommentFormData,
  DeleteCommentAction,
} from './types';
