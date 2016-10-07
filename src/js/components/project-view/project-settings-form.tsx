import * as React from 'react';
import { connect } from 'react-redux';
import { Field, FormProps, formValueSelector, reduxForm } from 'redux-form';

import { DeleteError } from '../../modules/errors';
import { onSubmitActions } from '../../modules/forms';
import Projects, { Project } from '../../modules/projects';
import Requests from '../../modules/requests';
import { StateTree } from '../../reducers';

import Confirmable from '../common/confirmable';
import FormField from '../common/forms/field';
import SetupInstructions from './setup-instructions';

const styles = require('../common/forms/modal-dialog.scss');

interface PassedProps {
  existingProjectNames: string[];
  onSubmitSuccess: () => void;
  initialValues: Project;
  deletionInProgress: boolean;
  deletionError?: DeleteError;
  deleteProject: () => void;
  closeDialog: (e: any) => void;
}

interface GeneratedStateProps {
  isProjectNameEdited: boolean;
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

class ProjectSettingsForm extends React.Component<Props & GeneratedStateProps, any> {
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
      deleteProject,
      isProjectNameEdited,
      initialValues: project,
    } = this.props;

    const submitButton = (
      <button
        type="submit"
        className={styles.submit}
        disabled={pristine || submitting || (invalid && !submitFailed)}
        onClick={handleSubmit}
      >
        {submitting ? 'Saving...' : 'Save'}
      </button>
    );

    const submitButtonToShow = isProjectNameEdited ? (
      <Confirmable
        title="Warning!"
        message={'Changing the name of your project will change the Git repository address as well. ' +
          'Are you sure you want to do this?'}
        action="Change name"
        onConfirm={handleSubmit}
      >
        {submitButton}
      </Confirmable>
    ) : submitButton;

    return (
      <form>
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
          <SetupInstructions project={project} showClone={true} />
        </div>
        <footer className={styles.footer}>
          <div className={styles['primary-actions']}>
            <a className={styles.cancel} onClick={closeDialog}>
              Cancel
            </a>
            {submitButtonToShow}
          </div>
          <div>
            {deletionInProgress ? 'Deleting...' : (
              <Confirmable
                title="Warning!"
                message={`Deleting a project cannot be undone. Are you sure you want to delete ${project.name}?`}
                action="Delete project"
                onConfirm={deleteProject}
              >
                <a className={styles.delete}>
                  Delete project
                </a>
              </Confirmable>
            )}
          </div>
        </footer>
      </form>
    );
  }
}

const mapStateToProps = (state: StateTree, ownProps: Props) => {
  const formSelector = formValueSelector('editProject');
  const visibleProjectName = formSelector(state, 'name') as string | undefined;
  return {
    isProjectNameEdited: !!visibleProjectName && visibleProjectName !== ownProps.initialValues.name,
  };
};

export default reduxForm({
  form: 'editProject',
  validate,
  onSubmit: onSubmitActions(
    Projects.actions.EDIT_PROJECT,
    Requests.actions.Projects.EditProject.SUCCESS.type,
    Requests.actions.Projects.EditProject.FAILURE.type,
  ),
})(connect<GeneratedStateProps, {}, Props>(mapStateToProps)(ProjectSettingsForm));
