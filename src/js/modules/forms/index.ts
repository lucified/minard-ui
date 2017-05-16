import { Dispatch } from 'redux';

export { default as createSagas } from './sagas';

// Based on https://github.com/yelouafi/redux-saga/issues/161#issuecomment-229350795
export const FORM_SUBMIT = 'FORMS/FORM_SUBMIT';
export interface FormSubmitAction {
  type: 'FORMS/FORM_SUBMIT';
  payload: {
    submitAction: string;
    successAction: string;
    failureAction: string;
    values: any;
    resolve: (idOrEntity: string | object) => void;
    reject: (error: any) => void;
  };
}

export function formSubmit(
  submitAction: string,
  successAction: string,
  failureAction: string,
  values: any,
  resolve: (idOrEntity: string | object) => void,
  reject: (error: any) => void,
): FormSubmitAction {
  return {
    type: FORM_SUBMIT,
    payload: {
      submitAction,
      successAction,
      failureAction,
      values,
      resolve,
      reject,
    },
  };
}

export const onSubmitPromiseCreator = (submitAction: string, successAction: string, failureAction: string) =>
  (values: any, dispatch: Dispatch<any>) =>
    new Promise((resolve, reject) => {
      dispatch(formSubmit(submitAction, successAction, failureAction, values, resolve, reject));
    });
