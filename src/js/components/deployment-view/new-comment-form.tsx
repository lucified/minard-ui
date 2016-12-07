import * as React from 'react';
import { Field, FormProps, reduxForm } from 'redux-form';

import Comments, { CreateCommentFormData } from '../../modules/comments';
import { onSubmitPromiseCreator } from '../../modules/forms';
import Requests from '../../modules/requests';

import FormField from '../common/forms/field';

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
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          {error && (
            <div className={styles['general-error']}>
              {error}
            </div>
          )}
          <Field
            name="name"
            component={FormField}
            type="text"
            label="Name"
            placeholder="Name (optional)"
            disabled={submitting}
          />
          <Field
            name="email"
            component={FormField}
            type="text"
            label="Email"
            placeholder="Email"
            disabled={submitting}
          />
          <Field
            name="message"
            component={FormField}
            type="textarea"
            label="Comment"
            placeholder="Add a comment"
            disabled={submitting}
          />
        </div>
        <div>
          <button type="submit" className={styles.submit} disabled={pristine || submitting || invalid}>
            {submitting ? 'Sending...' : 'Add comment'}
          </button>
        </div>
      </form>
    );
  }
};

export default reduxForm({
  form: 'newComment',
  validate,
  onSubmit: onSubmitPromiseCreator(
    Comments.actions.CREATE_COMMENT,
    Requests.actions.Comments.CreateComment.SUCCESS.type,
    Requests.actions.Comments.CreateComment.FAILURE.type,
  ),
})(NewCommentForm);
