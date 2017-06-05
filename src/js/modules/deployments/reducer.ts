import { mapKeys } from 'lodash';
import { Reducer } from 'redux';

import { logMessage } from '../../logger';
import { FetchError, isFetchError } from '../errors';
import Requests from '../requests';
import { CLEAR_STORED_DATA } from '../user';

import {
  ADD_COMMENTS_TO_DEPLOYMENT,
  REMOVE_COMMENT_FROM_DEPLOYMENT,
  SET_COMMENTS_FOR_DEPLOYMENT,
  STORE_DEPLOYMENTS,
} from './actions';
import {
  AddCommentsToDeploymentAction,
  Deployment,
  DeploymentState,
  RemoveCommentFromDeploymentAction,
  SetCommentsForDeploymentAction,
  StoreDeploymentsAction,
} from './types';

const initialState: DeploymentState = {};

const reducer: Reducer<DeploymentState> = (
  state = initialState,
  action: any,
) => {
  let fetchErrorAction: FetchError;
  let id: string;
  let existingDeployment: Deployment | FetchError;

  switch (action.type) {
    case Requests.actions.Deployments.LoadDeployment.FAILURE.type:
      fetchErrorAction = action as FetchError;
      id = fetchErrorAction.id;
      existingDeployment = state[id];
      if (!existingDeployment || isFetchError(existingDeployment)) {
        return {
          ...state,
          [id]: fetchErrorAction,
        };
      }

      logMessage('Fetching failed! Not replacing existing deployment entity', {
        action,
      });

      return state;
    case Requests.actions.Comments.LoadCommentsForDeployment.FAILURE.type:
      fetchErrorAction = action as FetchError;
      id = fetchErrorAction.id;
      existingDeployment = state[id];
      if (existingDeployment && !isFetchError(existingDeployment)) {
        if (
          !existingDeployment.comments ||
          isFetchError(existingDeployment.comments)
        ) {
          return {
            ...state,
            [id]: {
              ...existingDeployment,
              comments: fetchErrorAction,
            },
          };
        }

        logMessage('Not replacing existing comments with FetchError', {
          action,
        });

        return state;
      }

      logMessage('Deployment entity does not exist when setting comments', {
        action,
      });

      return state;
    // Add/replace deployments into state
    case STORE_DEPLOYMENTS:
      const deploymentsArray = (action as StoreDeploymentsAction).entities;
      if (deploymentsArray && deploymentsArray.length > 0) {
        const newDeploymentsObject: DeploymentState = mapKeys(
          deploymentsArray,
          d => d.id,
        );

        return {
          ...state,
          ...newDeploymentsObject,
        };
      }

      return state;
    // Replaces comments in the deployment
    case SET_COMMENTS_FOR_DEPLOYMENT:
      const commentsAction = action as SetCommentsForDeploymentAction;
      existingDeployment = state[commentsAction.id];
      if (existingDeployment && !isFetchError(existingDeployment)) {
        return {
          ...state,
          [commentsAction.id]: {
            ...existingDeployment,
            comments: commentsAction.comments,
            commentCount: commentsAction.comments.length,
          },
        };
      }

      logMessage('Trying to add comments to a deployment that does not exist', {
        action,
      });

      return state;
    // Appends comment to deployment
    case ADD_COMMENTS_TO_DEPLOYMENT:
      const addCommentsAction = action as AddCommentsToDeploymentAction;
      existingDeployment = state[addCommentsAction.id];
      if (existingDeployment && !isFetchError(existingDeployment)) {
        let newComments: string[];
        let newCommentCount = existingDeployment.commentCount || 0;

        if (
          !existingDeployment.comments ||
          isFetchError(existingDeployment.comments)
        ) {
          newComments = addCommentsAction.comments;
          newCommentCount += addCommentsAction.comments.length;
        } else {
          const existingComments = existingDeployment.comments;
          const commentsToAdd = addCommentsAction.comments.filter(
            comment => existingComments.indexOf(comment) === -1,
          );
          if (commentsToAdd.length > 0) {
            newComments = existingComments.concat(commentsToAdd);
            newCommentCount += commentsToAdd.length;
          } else {
            return state;
          }
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
      const removeCommentAction = action as RemoveCommentFromDeploymentAction;
      existingDeployment = state[removeCommentAction.id];
      if (existingDeployment && !isFetchError(existingDeployment)) {
        if (
          existingDeployment.comments &&
          !isFetchError(existingDeployment.comments)
        ) {
          const newComments = existingDeployment.comments.filter(
            comment => comment !== removeCommentAction.comment,
          );
          if (newComments.length < existingDeployment.comments.length) {
            return {
              ...state,
              [removeCommentAction.id]: {
                ...existingDeployment,
                comments: newComments,
                commentCount: newComments.length,
              },
            };
          }
        }
      }

      return state;
    case CLEAR_STORED_DATA:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
