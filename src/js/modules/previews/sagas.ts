import { call, Effect, put, select, takeEvery } from 'redux-saga/effects';

import { toComments, toCommits, toDeployments } from '../../api/convert';
import {
  Api,
  ApiEntity,
  ApiEntityResponse,
  ApiPreviewResponse,
} from '../../api/types';
import { logMessage } from '../../logger';
import { createEntityFetcher } from '../../sagas/utils';
import Comments from '../comments';
import Commits, { Commit } from '../commits';
import Deployments, { Deployment } from '../deployments';
import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';
import User from '../user';
import { LOAD_PREVIEW_AND_COMMENTS, storePreview } from './actions';
import { getPreview } from './selectors';
import { EntityType, LoadPreviewAndCommentsAction, Preview } from './types';

export default function createSagas(api: Api) {
  function* fetchPreview(
    id: string,
    entityType: EntityType,
    token: string,
    isUserLoggedIn: boolean,
  ): IterableIterator<Effect> {
    yield put(Requests.actions.Previews.LoadPreview.REQUEST.actionCreator(id));

    const {
      response,
      error,
      details,
      unauthorized,
    }: {
      response?: ApiPreviewResponse;
      error?: string;
      details?: string;
      unauthorized?: boolean;
    } = yield call(api.Preview.fetch, id, entityType, token);

    if (response) {
      const commit: Commit[] = yield call(toCommits, response.commit);
      yield put(Commits.actions.storeCommits(commit));

      const deployment: Deployment[] = yield call(
        toDeployments,
        response.deployment,
      );
      yield put(Deployments.actions.storeDeployments(deployment));

      // only store IDs into Preview, not the actual Commit and Deployment objects
      const preview: Preview = {
        ...response,
        commit: commit[0].id,
        deployment: deployment[0].id,
      };
      yield put(storePreview(preview, id, entityType));

      yield put(
        Requests.actions.Previews.LoadPreview.SUCCESS.actionCreator(id),
      );

      return true;
    } else {
      yield put(
        Requests.actions.Previews.LoadPreview.FAILURE.actionCreator(
          `${entityType}-${id}`, // TODO: Manually specifying this here is ugly. Fix it up at some point.
          error!,
          details,
          unauthorized,
        ),
      );

      if (unauthorized && !isUserLoggedIn) {
        yield put(
          User.actions.redirectToLogin(`/preview/${entityType}/${id}/${token}`),
        );
      }

      return false;
    }
  }

  function* loadPreviewAndComments(
    action: LoadPreviewAndCommentsAction,
  ): IterableIterator<Effect> {
    const { id, token, isUserLoggedIn, entityType } = action;
    const existingPreview: Preview = yield select(getPreview, id, entityType);
    let previewExists = !!existingPreview;

    if (!previewExists || isFetchError(existingPreview)) {
      previewExists = yield call(
        fetchPreview,
        id,
        entityType,
        token,
        isUserLoggedIn,
      );
    }

    if (previewExists) {
      const preview: Preview = yield select(getPreview, id, entityType);
      yield call(loadCommentsForDeployment, preview.deployment);
    }
  }

  // COMMENTS_FOR_DEPLOYMENT
  function* loadCommentsForDeployment(id: string): IterableIterator<Effect> {
    const deployment: Deployment | FetchError | undefined = yield select(
      Deployments.selectors.getDeployment,
      id,
    );

    // Return if we're already requesting
    if (yield select(Requests.selectors.isLoadingCommentsForDeployment, id)) {
      return;
    }

    if (!deployment || isFetchError(deployment)) {
      logMessage(
        'Deployment not found. Not fetching comments for deployment.',
        { id },
      );
    } else if (deployment.comments) {
      // Comments already exist. Do nothing.
      // TODO: remove this eventually once we make sure everything works ok
      console.log('Comments already exist in deployment.', deployment);
    } else {
      yield call(fetchCommentsForDeployment, id);
    }
  }

  const fetchCommentsForDeployment = createEntityFetcher(
    Requests.actions.Comments.LoadCommentsForDeployment,
    toComments,
    Comments.actions.storeComments,
    api.Comment.fetchForDeployment,
    setCommentsForDeployment,
  );

  function* setCommentsForDeployment(
    id: string,
    response: ApiEntityResponse,
  ): IterableIterator<Effect> {
    // The response contains the comments in reverse chronological order
    const commentIds = (response.data as ApiEntity[])
      .map((commit: any) => commit.id)
      .reverse();
    yield put(Deployments.actions.setCommentsForDeployment(id, commentIds));
  }

  return {
    sagas: [takeEvery(LOAD_PREVIEW_AND_COMMENTS, loadPreviewAndComments)],
  };
}
