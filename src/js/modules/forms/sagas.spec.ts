// tslint:disable:no-object-literal-type-assertion

import { expect } from 'chai';
import { SubmissionError } from 'redux-form';
import { call, put, race, take } from 'redux-saga/effects';

import { FormSubmitAction } from './index';
import createSagas from './sagas';

describe('Forms sagas', () => {
  const sagaFunctions = createSagas().functions;

  describe('formSubmitSaga', () => {
    const submitAction = 'SUBMITACTION';
    const successAction = 'SUCCESSACTION';
    const failureAction = 'FAILUREACTION';
    const values = { foo: 'bar' };
    const resolve = () => {}; // tslint:disable-line
    const reject = () => {}; // tslint:disable-line

    const action: FormSubmitAction = {
      type: 'FORMS/FORM_SUBMIT',
      payload: {
        submitAction,
        successAction,
        failureAction,
        values,
        resolve,
        reject,
      },
    };

    it('starts submitting form data', () => {
      const iterator = sagaFunctions.formSubmitSaga(action);

      expect(iterator.next().value).to.deep.equal(
        put({ type: submitAction, payload: values }),
      );
    });

    it('resolves the supplied promise if submitting is successful', () => {
      const iterator = sagaFunctions.formSubmitSaga(action);

      iterator.next();

      expect(iterator.next().value).to.deep.equal(
        race({
          success: take(successAction),
          failure: take(failureAction),
        }),
      );

      expect(iterator.next({ success: { result: { id: 3 }}}).value).to.deep.equal(
        call(resolve, { id: 3 }),
      );

      expect(iterator.next().done).to.equal(true);
    });

    it('rejects the promise with a SubmissionError if submitting the form fails', () => {
      const iterator = sagaFunctions.formSubmitSaga(action);

      iterator.next();

      expect(iterator.next().value).to.deep.equal(
        race({
          success: take(successAction),
          failure: take(failureAction),
        }),
      );

      expect(iterator.next({ failure: { prettyError: 'foobar' } }).value).to.deep.equal(
        call(reject, new SubmissionError({ _error: 'foobar' })),
      );

      expect(iterator.next().done).to.equal(true);
    });
  });
});
