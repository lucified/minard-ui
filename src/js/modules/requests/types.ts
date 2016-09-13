import { Action } from 'redux';

import { CreateError, DeleteError, EditError, FetchCollectionError, FetchError } from '../errors';

// State
export interface RequestInformation {
  type: string;
  id?: string;
}

export type RequestsState = RequestInformation[];

export interface ClearErrorAction extends Action {
  type: string;
  id?: string;
}

/// REQUEST / SUCCESS / FAILURE
interface RequestActionCreators<RequestCreatorType, SuccessCreatorType, FailureCreatorType> {
  REQUEST: {
    type: string;
    actionCreator: RequestCreatorType;
  };
  SUCCESS: {
    type: string;
    actionCreator: SuccessCreatorType;
  };
  FAILURE: {
    type: string;
    actionCreator: FailureCreatorType;
  };
}

// When requesting a specific entity
export interface EntityRequestAction extends Action {
  id: string;
}

export interface EntitySuccessAction extends Action {
  id: string;
}

interface CreateEntityRequestAction extends Action {
  name: string;
}

interface EntityRequestActionCreator {
  (id: string): EntityRequestAction;
};

interface EntitySuccessActionCreator {
  (id: string): EntitySuccessAction;
};

interface CreateEntityRequestActionCreator {
  (name: string): CreateEntityRequestAction;
}

// When request succeeds
interface CreateEntitySuccessAction extends Action {
  id: string;
  name: string;
}

interface CreateEntitySuccessActionCreator {
  (id: string, name: string): CreateEntitySuccessAction;
}

// When request fails
interface FetchEntityFailureActionCreator {
  (id: string, error: string, detail?: string): FetchError;
}

interface CreateEntityFailureActionCreator {
  (name: string, error: string, detail?: string): CreateError;
}

interface EditEntityFailureActionCreator {
  (id: string, error: string, detail?: string): EditError;
}

interface DeleteEntityFailureActionCreator {
  (id: string, error: string, detail?: string): DeleteError;
}

export type FetchEntityActionCreators = RequestActionCreators<
  EntityRequestActionCreator,
  EntitySuccessActionCreator,
  FetchEntityFailureActionCreator
>;

export type CreateEntityActionCreators = RequestActionCreators<
  CreateEntityRequestActionCreator,
  CreateEntitySuccessActionCreator,
  CreateEntityFailureActionCreator
>;

export type EditEntityActionCreators = RequestActionCreators<
  EntityRequestActionCreator,
  EntitySuccessActionCreator,
  EditEntityFailureActionCreator
>;

export type DeleteEntityActionCreators = RequestActionCreators<
  EntityRequestActionCreator,
  EntitySuccessActionCreator,
  DeleteEntityFailureActionCreator
>;

// When requesting all entities of a certain type
interface CollectionRequestAction extends Action {}
interface CollectionSuccessAction extends Action {}

interface CollectionRequestActionCreator {
  (): CollectionRequestAction;
}

interface CollectionSuccessActionCreator {
  (): CollectionSuccessAction;
}

interface CollectionFailureActionCreator {
  (error: string, detail?: string): FetchCollectionError;
}

export type CollectionActionCreators = RequestActionCreators<
  CollectionRequestActionCreator,
  CollectionSuccessActionCreator,
  CollectionFailureActionCreator
>;

// Store information about whether all activities have been requested
export interface AllActivitiesRequestedAction extends Action {}
export interface AllActivitiesRequestedForProjectAction extends Action {
  id: string;
}
