import * as React from 'react';
import { Dispatch } from 'redux';
import { Field, FormProps, initialize, reduxForm } from 'redux-form';

import { removeValue, setValue } from '../../cookie';
import Comments, { Comment, CreateCommentFormData } from '../../modules/comments';
import { onSubmitPromiseCreator } from '../../modules/forms';
import Requests from '../../modules/requests';

import FormField from '../common/forms/comment-field';

const styles = require('./new-comment-form.scss');

interface PassedProps {
  initialValues: Partial<CreateCommentFormData>;
}

type Props = PassedProps & FormProps<CreateCommentFormData, PassedProps, void>;

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

class NewCommentForm extends React.Component<Props, void> {
  constructor(props: Props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  private handleKeyDown(e: React.KeyboardEvent<any>) {
    const { handleSubmit } = this.props;

    if (handleSubmit && e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      // Submit on ctrl/cmd/meta + enter
      handleSubmit(e);
    }
  }

  public render() {
    const { handleSubmit, pristine, submitting, error, invalid } = this.props;

    return (
      <div className={styles['new-comment-form']}>
        <h4 className={styles.title}>Add a comment</h4>
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
            onKeyDown={this.handleKeyDown}
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
}

const formName = 'newComment';

export default reduxForm({
  form: formName,
  validate,
  onSubmit: (values: CreateCommentFormData, dispatch: Dispatch<any>) => {
    // Set cookies
    if (values.name) {
      setValue('commentName', values.name);
    } else {
      removeValue('commentName');
    }
    setValue('commentEmail', values.email);

    return onSubmitPromiseCreator(
      Comments.actions.CREATE_COMMENT,
      Requests.actions.Comments.CreateComment.SUCCESS.type,
      Requests.actions.Comments.CreateComment.FAILURE.type,
    )(values, dispatch);
  },
  onSubmitSuccess: (comment: Comment, dispatch: Dispatch<any>) => {
    // Clear message field
    dispatch(
      initialize(
        formName,
        {
          deployment: comment.deployment,
          name: comment.name,
          email: comment.email,
          message: '',
        },
        false,
      ),
    );
  },
})(NewCommentForm);
