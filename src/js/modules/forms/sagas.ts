import { SubmissionError } from 'redux-form';
import { takeEvery } from 'redux-saga';
import { call, Effect, put, race, take } from 'redux-saga/effects';

import { CreateError, EditError } from '../errors';
import { FORM_SUBMIT, FormSubmitAction } from '../forms';
import {
  CreateEntitySuccessAction,
  EditEntitySuccessAction,
} from '../requests';

export default function createSagas() {
  // FORMS
  function* formSubmitSaga({
    payload: {
      submitAction,
      successAction,
      failureAction,
      values,
      resolve,
      reject,
    },
  }: FormSubmitAction): IterableIterator<Effect> {
    yield put({ type: submitAction, payload: values });

    const {
      success,
      failure,
    }: {
      success: CreateEntitySuccessAction | EditEntitySuccessAction;
      failure: CreateError | EditError;
    } = yield race({
      success: take(successAction),
      failure: take(failureAction),
    });
    // success is the action generated by the .success() action creator and failure by .failure()

    // Resolve and reject tell the redux-form that submitting is done and if it was successful or not
    if (success) {
      yield call(resolve, success.result);
    } else {
      // _error indicates that it's a form-wide ("global") error
      yield call(
        reject,
        new SubmissionError({ _error: failure.details || failure.prettyError }),
      );
    }
  }

  return {
    sagas: [takeEvery(FORM_SUBMIT, formSubmitSaga)],
    // For unit testing
    functions: {
      formSubmitSaga,
    },
  };
}
