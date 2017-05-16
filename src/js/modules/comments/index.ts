import * as actions from './actions';
import reducer from './reducer';
import * as selectors from './selectors';

export default { actions, reducer, selectors };
export {
  Comment,
  CommentState,
  CreateCommentAction,
  CreateCommentFormData,
  DeleteCommentAction,
} from './types';
