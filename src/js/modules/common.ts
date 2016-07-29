import { Action } from 'redux';

interface RequestTypes {
  REQUEST: string;
  SUCCESS: string;
  FAILURE: string;
}

export const createRequestTypes = (base: string): RequestTypes => ({
  REQUEST: `${base}/REQUEST`,
  SUCCESS: `${base}/SUCCESS`,
  FAILURE: `${base}/FAILURE`,
});


export interface FetchEntityActionCreators {
  request: (id: string) => Action;
  success: (id: string, response: any) => RequestAction;
  failure: (id: string, error: any) => RequestAction;
};

export interface RequestAction extends Action {
  error?: any;
  response?: any;
}
