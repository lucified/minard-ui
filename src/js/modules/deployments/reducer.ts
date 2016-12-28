import { mapKeys } from 'lodash';
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
        return {
          ...state,
          [id]: fetchErrorAction,
        };
      }

      logMessage('Fetching failed! Not replacing existing deployment entity', { action });

      return state;
    case Requests.actions.Comments.LoadCommentsForDeployment.FAILURE.type:
      fetchErrorAction = <FetchError> action;
      id = fetchErrorAction.id;
      existingDeployment = state[id];
      if (existingDeployment && !isFetchError(existingDeployment)) {
        if (!existingDeployment.comments || isFetchError(existingDeployment.comments)) {
          return {
            ...state,
            [id]: {
              ...existingDeployment,
              comments: fetchErrorAction,
            },
          };
        }

        logMessage('Not replacing existing comments with FetchError', { action });

        return state;
      }

      logMessage('Deployment entity does not exist when setting comments', { action });

      return state;
    // Add/replace deployments into state
    case STORE_DEPLOYMENTS:
      const deploymentsArray = (<t.StoreDeploymentsAction> action).entities;
      if (deploymentsArray && deploymentsArray.length > 0) {
        const newDeploymentsObject: t.DeploymentState = mapKeys(deploymentsArray, d => d.id);

        return {
          ...state,
          ...newDeploymentsObject,
        };
      }

      return state;
    // Replaces comments in the deployment
    case SET_COMMENTS_FOR_DEPLOYMENT:
      const commentsAction = <t.SetCommentsForDeploymentAction> action;
      existingDeployment = state[commentsAction.id];
      if (existingDeployment && !isFetchError(existingDeployment)) {
        return {
          ...state,
          [commentsAction.id]: {
            ...existingDeployment,
            comments: commentsAction.comments,
          },
        };
      }

      logMessage('Trying to add comments to a deployment that does not exist', { action });

      return state;
    // Appends comment to deployment
    case ADD_COMMENTS_TO_DEPLOYMENT:
      const addCommentsAction = <t.AddCommentsToDeploymentAction> action;
      existingDeployment = state[addCommentsAction.id];
      if (existingDeployment && !isFetchError(existingDeployment)) {
        let newComments: string[];
        let newCommentCount = existingDeployment.commentCount || 0;

        if (!existingDeployment.comments || isFetchError(existingDeployment.comments)) {
          newComments = addCommentsAction.comments;
          newCommentCount += addCommentsAction.comments.length;
        } else {
          const existingComments = existingDeployment.comments;
          const commentsToAdd = addCommentsAction.comments.filter(comment => existingComments.indexOf(comment) === -1);
          newComments = existingDeployment.comments.concat(commentsToAdd);
          newCommentCount += commentsToAdd.length;
        }

        return {
          ...state,
          [addCommentsAction.id]: {
            ...existingDeployment,
            comments: newComments,
            commentCount: newCommentCount,
          },
        };
      }

      return state;
    case REMOVE_COMMENT_FROM_DEPLOYMENT:
      const removeCommentAction = <t.RemoveCommentFromDeploymentAction> action;
      existingDeployment = state[removeCommentAction.id];
      if (existingDeployment && !isFetchError(existingDeployment)) {
        if (existingDeployment.comments && !isFetchError(existingDeployment.comments)) {
          if (existingDeployment.comments.indexOf(removeCommentAction.comment) > -1) {
            const newComments = existingDeployment.comments.filter(comment => comment !== removeCommentAction.comment);
            return {
              ...state,
              [removeCommentAction.id]: {
                ...existingDeployment,
                comments: newComments,
                commentCount: existingDeployment.commentCount - 1,
              },
            };
          }
        }
      }

      return state;
    default:
      return state;
  }
};

export default reducer;
