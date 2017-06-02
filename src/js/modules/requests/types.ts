import { Action } from 'redux';

import {
  CreateError,
  DeleteError,
  EditError,
  FetchCollectionError,
  FetchError,
} from '../errors';

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
interface RequestActionCreators<
  RequestCreatorType,
  SuccessCreatorType,
  FailureCreatorType
> {
  // tslint:disable-line:one-line
  REQUEST: {
    type: string,
    actionCreator: RequestCreatorType,
  };
  SUCCESS: {
    type: string,
    actionCreator: SuccessCreatorType,
  };
  FAILURE: {
    type: string,
    actionCreator: FailureCreatorType,
  };
}

// When requesting a specific entity
export interface EntityRequestAction extends Action {
  id: string;
}

export interface EntitySuccessAction extends Action {
  id: string;
}

export interface CreateEntityRequestAction extends Action {
  name: string;
}

type EntityRequestActionCreator = (id: string) => EntityRequestAction;
type EntitySuccessActionCreator = (id: string) => EntitySuccessAction;
type CreateEntityRequestActionCreator = (
  name: string,
) => CreateEntityRequestAction;

// When request succeeds
export interface CreateEntitySuccessAction extends Action {
  result: object;
  name: string;
}

type CreateEntitySuccessActionCreator = (
  entity: any,
  name: string,
) => CreateEntitySuccessAction;

export interface EditEntitySuccessAction extends Action {
  result: object;
}

type EditEntitySuccessActionCreator = (entity: any) => EditEntitySuccessAction;
// When request fails
type FetchEntityFailureActionCreator = (
  id: string,
  error: string,
  detail?: string,
  unauthorized?: boolean,
) => FetchError;
type CreateEntityFailureActionCreator = (
  name: string,
  error: string,
  detail?: string,
  unauthorized?: boolean,
) => CreateError;
type EditEntityFailureActionCreator = (
  id: string,
  error: string,
  detail?: string,
  unauthorized?: boolean,
) => EditError;
type DeleteEntityFailureActionCreator = (
  id: string,
  error: string,
  detail?: string,
  unauthorized?: boolean,
) => DeleteError;

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
  EditEntitySuccessActionCreator,
  EditEntityFailureActionCreator
>;

export type DeleteEntityActionCreators = RequestActionCreators<
  EntityRequestActionCreator,
  EntitySuccessActionCreator,
  DeleteEntityFailureActionCreator
>;

// When requesting all entities of a certain type
export interface CollectionRequestAction extends Action {}
export interface CollectionSuccessAction extends Action {}

type CollectionRequestActionCreator = () => CollectionRequestAction;
type CollectionSuccessActionCreator = () => CollectionSuccessAction;
type CollectionFailureActionCreator = (
  error: string,
  detail?: string,
  unauthorized?: boolean,
) => FetchCollectionError;

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
