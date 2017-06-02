import { call, Effect, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { toComments } from '../../api/convert';
import { Api } from '../../api/types';
import Deployments from '../deployments';
import Requests from '../requests';
import { CREATE_COMMENT, DELETE_COMMENT, storeComments } from './actions';
import { Comment, CreateCommentAction, DeleteCommentAction } from './types';

export default function createSagas(api: Api) {
  // DELETE_COMMENT
  function* deleteComment(
    action: DeleteCommentAction,
  ): IterableIterator<Effect> {
    const { id } = action;

    yield put(
      Requests.actions.Comments.DeleteComment.REQUEST.actionCreator(id),
    );

    const { response, error, details, unauthorized } = yield call(
      api.Comment.delete,
      id,
    );

    if (response) {
      yield put(
        Requests.actions.Comments.DeleteComment.SUCCESS.actionCreator(id),
      );

      return true;
    } else {
      yield put(
        Requests.actions.Comments.DeleteComment.FAILURE.actionCreator(
          id,
          error,
          details,
          unauthorized,
        ),
      );

      return false;
    }
  }

  // CREATE_COMMENT
  function* createComment(
    action: CreateCommentAction,
  ): IterableIterator<Effect> {
    const { name, deployment, email, message } = action.payload;
    const requestName = `${deployment}-${message}`;

    yield put(
      Requests.actions.Comments.CreateComment.REQUEST.actionCreator(
        requestName,
      ),
    );

    const {
      response,
      error,
      details,
      unauthorized,
    }: {
      response?: any,
      error?: string,
      details?: string,
      unauthorized?: boolean,
    } = yield call(api.Comment.create, deployment, message, email, name);

    if (response) {
      // Store new comment
      const commentObjects: Comment[] = yield call(toComments, response.data);
      yield put(storeComments(commentObjects));
      yield put(
        Deployments.actions.addCommentsToDeployment(
          deployment,
          commentObjects.map(comment => comment.id),
        ),
      );

      // Notify form that creation was a success
      yield put(
        Requests.actions.Comments.CreateComment.SUCCESS.actionCreator(
          commentObjects[0],
          requestName,
        ),
      );

      return true;
    } else {
      // Notify form that creation failed
      yield put(
        Requests.actions.Comments.CreateComment.FAILURE.actionCreator(
          requestName,
          error!,
          details,
          unauthorized,
        ),
      );

      return false;
    }
  }

  return {
    functions: {
      createComment,
      deleteComment,
    },
    sagas: [
      takeLatest(CREATE_COMMENT, createComment),
      takeEvery(DELETE_COMMENT, deleteComment),
    ],
  };
}
