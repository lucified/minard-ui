import * as classNames from 'classnames';
import * as React from 'react';
import { Dispatch } from 'redux';
import { Field, BaseFieldProps, FormProps, reduxForm } from 'redux-form';

import { onSubmitActions } from '../../modules/forms';
import Projects, { Project } from '../../modules/projects';

import confirm from '../common/confirm';

const styles = require('../common/modal-dialog.scss');

interface PassedProps {
  existingProjectNames: string[];
  onSubmitSuccess: () => void;
  initialValues: Project;
}

interface FormData {
  name?: string;
  description?: string;
}

type Props = PassedProps & FormProps<FormData, any>;

const checkNameChangeAndSubmit = async (values: FormData, dispatch: Dispatch<any>, props: Props) => {
  if (values.name !== props.initialValues.name) {
    await confirm('Changing the name of your project will change the repository address as well. Are you sure you want to do this?');
  }

  return onSubmitActions(
    Projects.actions.EDIT_PROJECT,
    Projects.actions.SEND_EDIT_PROJECT.SUCCESS,
    Projects.actions.SEND_EDIT_PROJECT.FAILURE,
  )(values, dispatch);
}

// TODO: make a proper definition file
interface ValidationError {
  name: "ValidationError";
  path: string;
  message: string;
  errors: string[];
  inner: ValidationError[];
}

const asyncValidate = (values: FormData, dispatch: Dispatch<any>, props: Props) =>
  new Promise((resolve, reject) => {
    Projects.schema(props.existingProjectNames).validate(values, { abortEarly: false })
      .then(() => {
        resolve();
      })
      .catch((errors: ValidationError) => {
        let formErrors: { [field: string]: string } = {};

        errors.inner.forEach(error => {
          formErrors[error.path] = error.message;
        })

        reject(formErrors);
      })
    });

const RenderField = ({ input, name, label, placeholder, type, meta: { touched, error }}: BaseFieldProps) => (
  <div className="row">
    <div className="col-xs-4">
      <label htmlFor={name}>{label}</label>
    </div>
    <div className="col-xs-8">
      <input {...input} placeholder={placeholder} type={type} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  </div>
);

class ProjectSettingsForm extends React.Component<Props, any> {
  public render() {
    const { handleSubmit, pristine, submitting, error, invalid, submitFailed } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="row">
            <div className={classNames('col-xs-12', styles['general-error'])}>
              {error}
            </div>
          </div>
        )}
        <Field name="name" component={RenderField} type="text" label="Name" placeholder="my-project-name" />
        <Field name="description" component={RenderField} type="textarea" label="Description" placeholder="Describe your project" />
        <div className="row">
          <div className="col-xs-12">
            <button type="submit" disabled={pristine || submitting || (invalid && !submitFailed)}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'editProject',
  asyncValidate,
  onSubmit: checkNameChangeAndSubmit as any // redux-form typings are missing the third props param
})(ProjectSettingsForm);
