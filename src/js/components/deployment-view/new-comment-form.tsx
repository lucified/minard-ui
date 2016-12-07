import * as React from 'react';
import { Dispatch } from 'redux';
import { Field, FormProps, reduxForm, reset } from 'redux-form';

import Comments, { CreateCommentFormData } from '../../modules/comments';
import { onSubmitPromiseCreator } from '../../modules/forms';
import Requests from '../../modules/requests';

import FormField from '../common/forms/comment-field';

const styles = require('./new-comment-form.scss');

interface PassedProps {
  initialValues: {
    deployment: string;
    name?: string;
    email?: string;
    message?: string;
  };
}

type Props = PassedProps & FormProps<CreateCommentFormData, any>;

const validate = (values: CreateCommentFormData) => {
  const { email, message } = values;
  const errors: any = {};

  if (!email) {
    errors.email = 'Required';
  } else if (!/(.+)@(.+){2,}\.(.+){2,}/.test(email)) {
    // Note: this validation regexp is simple rather than foolproof
    errors.email = 'Enter a valid email';
  }

  if (!message) {
    errors.message = 'Required';
  }

  return errors;
};

class NewCommentForm extends React.Component<Props, any> {
  public render() {
    const { handleSubmit, pristine, submitting, error, invalid } = this.props;

    return (
      <div className={styles['new-comment-form']}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles['general-error']}>
              {error}
            </div>
          )}
          <Field
            name="name"
            component={FormField}
            type="text"
            placeholder="Name (optional)"
            disabled={submitting}
          />
          <Field
            name="email"
            component={FormField}
            type="text"
            placeholder="Email"
            disabled={submitting}
          />
          <Field
            name="message"
            component={FormField}
            type="textarea"
            placeholder="Comment"
            disabled={submitting}
          />
          <footer className={styles.footer}>
            <button type="submit" className={styles.submit} disabled={pristine || submitting || invalid}>
              {submitting ? 'Sending...' : 'Add comment'}
            </button>
          </footer>
        </form>
      </div>
    );
  }
};

const formName = 'newComment';

export default reduxForm({
  form: formName,
  validate,
  onSubmit: onSubmitPromiseCreator(
    Comments.actions.CREATE_COMMENT,
    Requests.actions.Comments.CreateComment.SUCCESS.type,
    Requests.actions.Comments.CreateComment.FAILURE.type,
  ),
  onSubmitSuccess: (_values: any, dispatch: Dispatch<any>) => {
    dispatch(reset(formName));
  },
})(NewCommentForm);
