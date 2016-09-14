import * as React from 'react';
import { Dispatch } from 'redux';
import { Field, FormProps, reduxForm } from 'redux-form';

import { DeleteError } from '../../modules/errors';
import { onSubmitActions } from '../../modules/forms';
import Projects, { Project } from '../../modules/projects';
import Requests from '../../modules/requests';

import confirm from '../common/confirm';
import FormField from '../common/forms/field';

const styles = require('../common/forms/modal-dialog.scss');

interface PassedProps {
  existingProjectNames: string[];
  onSubmitSuccess: () => void;
  initialValues: Project;
  deletionInProgress: boolean;
  deletionError?: DeleteError;
  confirmDeletion: (e: any) => void;
  closeDialog: (e: any) => void;
}

interface FormData {
  name?: string;
  description?: string;
}

type Props = PassedProps & FormProps<FormData, any>;

const checkNameChangeAndSubmit = async (values: FormData, dispatch: Dispatch<any>, props: Props) => {
  if (values.name !== props.initialValues.name) {
    await confirm('Changing the name of your project will change the ' +
      'repository address as well. Are you sure you want to do this?');
  }

  return onSubmitActions(
    Projects.actions.EDIT_PROJECT,
    Requests.actions.Projects.EditProject.SUCCESS.type,
    Requests.actions.Projects.EditProject.FAILURE.type,
  )(values, dispatch);
};

const validate = (values: FormData, props: Props) => {
  const errors: FormData = {};
  const projectNameRegex = /^[a-z0-9\-]+$/;

  const { name, description } = values;

  if (!name) {
    errors.name = 'Required';
  } else if (!projectNameRegex.test(name)) {
    errors.name = 'Only letters, numbers, and hyphens allowed';
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

class ProjectSettingsForm extends React.Component<Props, any> {
  public render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      error,
      invalid,
      closeDialog,
      submitFailed,
      deletionInProgress,
      deletionError,
      confirmDeletion,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          {error && (
            <div className={styles['general-error']}>
              {error}
            </div>
          )}
          {deletionError && (
            <div className={styles['general-error']}>
              {deletionError.prettyError}
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
            <button
              type="submit"
              className={styles.submit}
              disabled={pristine || submitting || (invalid && !submitFailed)}
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
          <div className={styles.delete}>
            {deletionInProgress ? 'Deleting...' : (
              <a onClick={confirmDeletion}>
                Delete project
              </a>
            )}
          </div>
        </footer>
      </form>
    );
  }
}

export default reduxForm({
  form: 'editProject',
  validate,
  onSubmit: checkNameChangeAndSubmit as any, // redux-form typings are missing the third props param
})(ProjectSettingsForm);
