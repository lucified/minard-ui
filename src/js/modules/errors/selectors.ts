import { createSelector } from 'reselect';

import { StateTree } from '../../reducers';
import Activities from '../activities';
import Projects from '../projects';

import * as t from './types';

const selectErrorTree = (state: StateTree): t.ErrorState => state.errors;

export const getFetchCollectionErrors =
  createSelector<StateTree, t.FetchCollectionError[], t.ErrorState>(
    selectErrorTree,
    (errors) => errors.filter((error: t.Error) =>
      [
        Projects.actions.ALL_PROJECTS.FAILURE,
        Activities.actions.ACTIVITIES.FAILURE,
        Activities.actions.ACTIVITIES_FOR_PROJECT.FAILURE,
      ].indexOf(error.type) > -1,
    )
  );

export const getProjectDeletionError = (state: StateTree, id: string): t.DeleteError | undefined =>
  <t.DeleteError | undefined> selectErrorTree(state).find(error =>
    (error.type === Projects.actions.SEND_DELETE_PROJECT.FAILURE) &&
    ((<t.DeleteError> error).id === id)
  );
