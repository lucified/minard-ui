import { Reducer } from 'redux';

import { logMessage } from '../../logger';
import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';

import {
  ADD_COMMENTS_TO_DEPLOYMENT,
  REMOVE_COMMENT_FROM_DEPLOYMENT,
  SET_COMMENTS_FOR_DEPLOYMENT,
  STORE_DEPLOYMENTS,
} from './actions';
import * as t from './types';

const initialState: t.DeploymentState = {};

const reducer: Reducer<t.DeploymentState> = (state = initialState, action: any) => {
  let fetchErrorAction: FetchError;
  let id: string;
  let existingDeployment: t.Deployment | FetchError;

  switch (action.type) {
    case Requests.actions.Deployments.LoadDeployment.FAILURE.type:
      fetchErrorAction = <FetchError> action;
      id = fetchErrorAction.id;
      existingDeployment = state[id];
      if (!existingDeployment || isFetchError(existingDeployment)) {
        return Object.assign({}, state, { [id]: fetchErrorAction });
      }

      logMessage('Fetching failed! Not replacing existing deployment entity', { action });

      return state;
    case Requests.actions.Comments.LoadCommentsForDeployment.FAILURE.type:
      fetchErrorAction = <FetchError> action;
      id = fetchErrorAction.id;
      existingDeployment = state[id];
      if (existingDeployment && !isFetchError(existingDeployment)) {
        if (!existingDeployment.comments || isFetchError(existingDeployment.comments)) {
          const newDeploymentObject = Object.assign({}, existingDeployment, { comments: fetchErrorAction });
          return Object.assign({}, state, { [id]: newDeploymentObject });
        }

        logMessage('Not replacing existing comments with FetchError', { action });

        return state;
      }

      logMessage('Deployment entity does not exist when setting comments', { action });

      return state;
    case STORE_DEPLOYMENTS:
      const deploymentsArray = (<t.StoreDeploymentsAction> action).entities;
      if (deploymentsArray && deploymentsArray.length > 0) {
        const newDeploymentsObject: t.DeploymentState =
          deploymentsArray.reduce<t.DeploymentState>((obj: t.DeploymentState, newDeployment: t.Deployment) =>
            Object.assign(obj, { [newDeployment.id]: newDeployment }),
          {});

        return Object.assign({}, state, newDeploymentsObject);
      }

      return state;
    case SET_COMMENTS_FOR_DEPLOYMENT:
      const commentsAction = <t.SetCommentsForDeploymentAction> action;
      existingDeployment = state[commentsAction.id];
      if (existingDeployment && !isFetchError(existingDeployment)) {
        const newDeployment = Object.assign({}, existingDeployment, { comments: commentsAction.comments });
        return Object.assign({}, state, { [commentsAction.id]: newDeployment });
      }

      logMessage('Trying to add comments to a deployment that does not exist', { action });

      return state;
    case ADD_COMMENTS_TO_DEPLOYMENT:
      const addCommentsAction = <t.AddCommentsToDeploymentAction> action;
      existingDeployment = state[addCommentsAction.id];
      if (existingDeployment && !isFetchError(existingDeployment)) {
        let newComments: string[];
        if (!existingDeployment.comments || isFetchError(existingDeployment.comments)) {
          newComments = addCommentsAction.comments;
        } else {
          const existingComments = existingDeployment.comments;
          const commentsToAdd = addCommentsAction.comments.filter(comment => existingComments.indexOf(comment) === -1);
          newComments = existingDeployment.comments.concat(commentsToAdd);
        }
        const newDeployment = Object.assign({}, existingDeployment, { comments: newComments });
        return Object.assign({}, state, { [addCommentsAction.id]: newDeployment });
      }

      logMessage('Trying to add comments to a deployment that does not exist', { action });

      return state;
    case REMOVE_COMMENT_FROM_DEPLOYMENT:
      const removeCommentAction = <t.RemoveCommentFromDeploymentAction> action;
      existingDeployment = state[removeCommentAction.id];
      if (existingDeployment && !isFetchError(existingDeployment)) {
        if (existingDeployment.comments && !isFetchError(existingDeployment.comments)) {
          if (existingDeployment.comments.indexOf(removeCommentAction.comment) > -1) {
            const newComments = existingDeployment.comments.filter(comment => comment !== removeCommentAction.comment);
            const newDeployment = Object.assign({}, existingDeployment, { comments: newComments });
            return Object.assign({}, state, { [removeCommentAction.id]: newDeployment });
          }
        }
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
