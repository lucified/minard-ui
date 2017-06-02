import { createSelector } from 'reselect';

import { StateTree } from '../../reducers';
import Requests from '../requests';
import { SIGNUP_ERROR } from './actions';

import {
  DeleteError,
  ErrorState,
  FetchCollectionError,
  MinardError,
  SignupError,
} from './types';

const selectErrorTree = (state: StateTree): ErrorState => state.errors;

export const getFetchCollectionErrors = createSelector<
  StateTree,
  FetchCollectionError[],
  ErrorState
>(selectErrorTree, errors =>
  errors.filter(
    (error: MinardError) =>
      [
        Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        Requests.actions.Activities.LoadAllActivities.FAILURE.type,
        Requests.actions.Activities.LoadActivitiesForProject.FAILURE.type,
      ].indexOf(error.type) > -1,
  ),
);

export const getProjectDeletionError = (
  state: StateTree,
  id: string,
): DeleteError | undefined =>
  selectErrorTree(state).find(
    error =>
      error.type === Requests.actions.Projects.DeleteProject.FAILURE.type &&
      (error as DeleteError).id === id,
  ) as DeleteError | undefined;

export const getSignupError = (state: StateTree): SignupError | undefined =>
  selectErrorTree(state).find(error => error.type === SIGNUP_ERROR) as
    | SignupError
    | undefined;
