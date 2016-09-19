import * as React from 'react';
import { Field, FormProps, reduxForm } from 'redux-form';

import { onSubmitActions } from '../../modules/forms';
import Projects from '../../modules/projects';
import Requests from '../../modules/requests';

import FormField from '../common/forms/field';

const styles = require('../common/forms/modal-dialog.scss');

interface PassedProps {
  existingProjectNames: string[];
  onSubmitSuccess: (projectId: string) => void;
  closeDialog: () => void;
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
    errors.name = 'Only letters, numbers, and hyphens allowed';
  } else if (name[0] === '-') {
    errors.name = 'Project name can\'t start with a hyphen';
  } else if (props.existingProjectNames.indexOf(name) > -1) {
    errors.name = 'Project name already exists';
  }

  if (description && description.length > 2000) {
    errors.description = 'The description can be up to 2000 characters long';
  }

  return errors;
};

const toLowerCase = (value?: string): string | undefined => value && value.toLowerCase();
const spaceToHyphen = (value?: string): string | undefined => value && value.replace(/ /, '-');
const normalizeProjectName = (value?: string): string | undefined => spaceToHyphen(toLowerCase(value));

class NewProjectForm extends React.Component<Props, any> {
  public render() {
    const { handleSubmit, pristine, submitting, error, invalid, closeDialog } = this.props;

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
            placeholder="my-project-name"
            instructions="May only contain letters, numbers, and hyphens"
            normalize={normalizeProjectName}
          />
          <Field
            name="description"
            component={FormField}
            type="textarea"
            label="Description"
            placeholder="Describe your project"
          />
        </div>
        <footer className={styles.footer}>
          <div>
            <a className={styles.cancel} onClick={closeDialog}>
              Cancel
            </a>

            <button type="submit" className={styles.submit} disabled={pristine || submitting || invalid}>
              {submitting ? 'Creating...' : 'Create project'}
            </button>
          </div>
        </footer>
      </form>
    );
  }
};

export default reduxForm({
  form: 'newProject',
  validate,
  onSubmit: onSubmitActions(
    Projects.actions.CREATE_PROJECT,
    Requests.actions.Projects.CreateProject.SUCCESS.type,
    Requests.actions.Projects.CreateProject.FAILURE.type,
  ),
})(NewProjectForm);
