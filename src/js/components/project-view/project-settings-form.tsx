import * as classNames from 'classnames';
import * as React from 'react';
import { Dispatch } from 'redux';
import { Field, BaseFieldProps, FormProps, reduxForm } from 'redux-form';

import { onSubmitActions } from '../../modules/forms';
import Projects, { Project } from '../../modules/projects';

const styles = require('../common/modal-dialog.scss');

interface PassedProps {
  existingProjectNames: string[];
  onSubmitSuccess: () => void;
  onClose: () => void;
  initialValues: Project;
}

interface FormData {
  name?: string;
  description?: string;
}

type Props = PassedProps & FormProps<FormData, any>;

const validate = (values: FormData, props: Props) => {
  const errors: FormData = {};
  const projectNameRegex = /^[a-z0-9\-]+$/;

  const { name, description } = values;

  if (!name) {
    errors.name = 'Required';
  } else if (!projectNameRegex.test(name)) {
    errors.name = 'Only lower-case letters, numbers and dashes allowed.';
  } else if (props.existingProjectNames.indexOf(name) > -1) {
    errors.name = 'Project name already exists';
  }

  if (description && description.length > 2000) {
    errors.description = 'The description can be up to 2000 characters long.'
  }

  return errors;
};

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
    const { handleSubmit, pristine, submitting, error, invalid } = this.props;

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
            <button type="submit" disabled={pristine || submitting || invalid}>
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
  validate,
  onSubmit: onSubmitActions(
    Projects.actions.EDIT_PROJECT,
    Projects.actions.SEND_EDIT_PROJECT.SUCCESS,
    Projects.actions.SEND_EDIT_PROJECT.FAILURE,
  )
})(ProjectSettingsForm);