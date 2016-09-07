import { Action } from 'redux';
import { CreateError, DeleteError, EditError, FetchError, FetchCollectionError } from './errors'

export interface User {
  name?: string;
  email: string;
  timestamp: number;
}

export interface ApiUser {
  name?: string;
  email: string;
  timestamp: string;
}

// Fetch a single entity
interface RequestFetchRequestAction extends Action {
  id: string;
}

interface RequestFetchSuccessAction<ResponseType> extends Action {
  id: string;
  response: ResponseType;
}

export interface RequestFetchActionCreators<ResponseEntity> {
  request: (id: string) => RequestFetchRequestAction;
  success: (id: string, response: ResponseEntity) => RequestFetchSuccessAction<ResponseEntity>;
  failure: (id: string, error: string, details?: string) => FetchError;
}

// Fetch a collection
interface RequestFetchCollectionRequestAction extends Action {

}

interface RequestFetchCollectionSuccessAction<ResponseType> extends Action {
  response: ResponseType;
}

export interface RequestFetchCollectionActionCreators<ResponseEntity> {
  request: () => RequestFetchCollectionRequestAction;
  success: (response: ResponseEntity) => RequestFetchCollectionSuccessAction<ResponseEntity>;
  failure: (error: string, details?: string) => FetchCollectionError;
}

// Fetch a specific collection (e.g. branches of project)
interface RequestFetchSpecificCollectionRequestAction extends Action {
  id: string;
}

interface RequestFetchSpecificCollectionSuccessAction<ResponseType> extends Action {
  response: ResponseType;
}

export interface RequestFetchSpecificCollectionActionCreators<ResponseEntity> {
  request: (id: string) => RequestFetchSpecificCollectionRequestAction;
  success: (id: string, response: ResponseEntity) => RequestFetchSpecificCollectionSuccessAction<ResponseEntity>;
  failure: (id: string, error: string, details?: string) => FetchCollectionError;
}

// Create an entity
interface RequestCreateRequestAction extends Action {
  name: string;
}

interface RequestCreateSuccessAction extends Action {
  id: string;
}

export interface RequestCreateActionCreators {
  request: (name: string) => RequestCreateRequestAction;
  success: (id: string) => RequestCreateSuccessAction;
  failure: (error: string, details?: string) => CreateError;
}

// Edit an entity
interface RequestEditRequestAction extends Action {
  id: string;
}

interface RequestEditSuccessAction extends Action {
  id: string;
}

export interface RequestEditActionCreators {
  request: (id: string) => RequestEditRequestAction;
  success: (id: string) => RequestEditSuccessAction;
  failure: (id: string, error: string, details?: string) => EditError;
}

// Delete an entity
interface RequestDeleteRequestAction extends Action {
  id: string;
}

interface RequestDeleteSuccessAction extends Action {
  id: string;
}

export interface RequestDeleteActionCreators {
  request: (id: string) => RequestDeleteRequestAction;
  success: (id: string) => RequestDeleteSuccessAction;
  failure: (id: string, error: string, details?: string) => DeleteError;
}
