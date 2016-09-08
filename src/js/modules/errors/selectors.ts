import { createSelector } from 'reselect';

import { StateTree } from '../../reducers';
import Requests from '../requests';

import * as t from './types';

const selectErrorTree = (state: StateTree): t.ErrorState => state.errors;

export const getFetchCollectionErrors =
  createSelector<StateTree, t.FetchCollectionError[], t.ErrorState>(
    selectErrorTree,
    (errors) => errors.filter((error: t.Error) =>
      [
        Requests.actions.Projects.LoadAllProjects.FAILURE.type,
        Requests.actions.Activities.LoadAllActivities.FAILURE.type,
        Requests.actions.Activities.LoadActivitiesForProject.FAILURE.type,
      ].indexOf(error.type) > -1,
    )
  );

export const getProjectDeletionError = (state: StateTree, id: string): t.DeleteError | undefined =>
  <t.DeleteError | undefined> selectErrorTree(state).find(error =>
    (error.type === Requests.actions.Projects.DeleteProject.FAILURE.type) &&
    ((<t.DeleteError> error).id === id)
  );
