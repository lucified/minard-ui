import { Dispatch } from 'redux';

// Based on https://github.com/yelouafi/redux-saga/issues/161#issuecomment-229350795
export const FORM_SUBMIT = 'FORMS/FORM_SUBMIT';

export function formSubmit(
  submitAction: string,
  successAction: string,
  failureAction: string,
  values: any,
  resolve: (result: any) => void,
  reject: (error: any) => void
) {
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

export function onSubmitActions(submitAction: string, successAction: string, failureAction: string) {
  return (values: any, dispatch: Dispatch<any>) =>
    new Promise((resolve, reject) => {
      dispatch(formSubmit(submitAction, successAction, failureAction, values, resolve, reject));
    });
}
