import * as classNames from 'classnames';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Field, FormProps, formValueSelector, reduxForm } from 'redux-form';

import { DeleteError } from '../../modules/errors';
import { onSubmitPromiseCreator } from '../../modules/forms';
import Projects, { EditProjectFormData, Project } from '../../modules/projects';
import Requests from '../../modules/requests';
import { StateTree } from '../../reducers';

import Confirmable from '../common/confirmable';
import FormField from '../common/forms/field';
import Toggle from '../common/forms/toggle';
import GitHubNotifications from './github-notifications';
import SetupInstructions from './setup-instructions';

const styles = require('../common/forms/modal-dialog.scss');

interface PassedProps {
  existingProjectNames: string[];
  onSubmitSuccess: () => void;
  initialValues: Project;
  deletionInProgress: boolean;
  deletionError?: DeleteError;
  deleteProject: () => void;
  closeDialog: (e: React.MouseEvent<HTMLElement>) => void;
}

interface GeneratedStateProps {
  isProjectNameEdited: boolean;
  projectVisibilityRequestInProgress: boolean;
}

interface GeneratedDispatchProps {
  setProjectVisibility: (id: string, isPublic: boolean) => void;
}

type Props = PassedProps &
  FormProps<
    EditProjectFormData,
    PassedProps & GeneratedStateProps & GeneratedDispatchProps,
    void
  >;

const validate = (values: EditProjectFormData, props: Props) => {
  const errors: Partial<EditProjectFormData> = {};
  const projectNameRegex = /^[a-z0-9\-]+$/;

  const { name, description } = values;

  if (!name) {
    errors.name = 'Required';
  } else if (!projectNameRegex.test(name)) {
    errors.name = 'Only letters, numbers, and hyphens allowed';
  } else if (name[0] === '-') {
    errors.name = "Project name can't start with a hyphen";
  } else if (name.length > 220) {
    errors.name = 'Maximum length of 220 characters';
  } else if (props.existingProjectNames.indexOf(name) > -1) {
    errors.name = 'Project name already exists';
  }

  if (description && description.length > 2000) {
    errors.description = 'Maximum length of 2000 characters';
  }

  return errors;
};

const toLowerCase = (value?: string): string | undefined =>
  value && value.toLowerCase();
const spaceToHyphen = (value?: string): string | undefined =>
  value && value.replace(/ /, '-');
const normalizeProjectName = (value?: string): string | undefined =>
  spaceToHyphen(toLowerCase(value));

class ProjectSettingsForm extends React.Component<
  Props & GeneratedStateProps & GeneratedDispatchProps
> {
  constructor(props: GeneratedStateProps & GeneratedDispatchProps & Props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  private handleCancel(e: React.MouseEvent<HTMLElement>) {
    const { submitting, closeDialog } = this.props;

    if (!submitting) {
      closeDialog(e);
    }
  }

  private handleToggleVisibility = (isPublic: boolean) => {
    this.props.setProjectVisibility(this.props.initialValues.id, isPublic);
  };

  public render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      error,
      invalid,
      submitFailed,
      deletionInProgress,
      deletionError,
      deleteProject,
      isProjectNameEdited,
      initialValues: project,
      projectVisibilityRequestInProgress,
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

    // tslint:disable:jsx-alignment
    const submitButtonToShow = isProjectNameEdited
      ? <Confirmable
          title="Warning!"
          message={
            'Changing the name of your project will change the Git repository address as well. ' +
            'Are you sure you want to do this?'
          }
          action="Change name"
          onConfirm={handleSubmit}
        >
          {submitButton}
        </Confirmable>
      : submitButton;

    return (
      <form>
        <div className={styles.form}>
          {error &&
            <div className={styles['general-error']}>
              {error}
            </div>}
          {deletionError &&
            <div className={styles['general-error']}>
              {deletionError.prettyError}
            </div>}
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
          <Toggle
            label="Visibility"
            text="Previews are open to everyone"
            checked={project.isPublic}
            onChange={this.handleToggleVisibility}
            disabled={projectVisibilityRequestInProgress}
          />
          <SetupInstructions project={project} />
          <GitHubNotifications project={project} />
        </div>
        <footer className={styles.footer}>
          <div className={styles['primary-actions']}>
            <a
              className={classNames(styles.cancel, {
                [styles['disabled-link']]: submitting || deletionInProgress,
              })}
              onClick={this.handleCancel}
            >
              Cancel
            </a>
            {submitButtonToShow}
          </div>
          <div>
            {deletionInProgress
              ? 'Deleting...'
              : <Confirmable
                  title="Warning!"
                  message={`Deleting a project cannot be undone. Are you sure you want to delete ${project.name}?`}
                  action="Delete project"
                  onConfirm={deleteProject}
                >
                  <a className={styles.delete}>Delete project</a>
                </Confirmable>}
          </div>
        </footer>
      </form>
    );
  }
}

const mapStateToProps = (
  state: StateTree,
  ownProps: Props,
): GeneratedStateProps => {
  const formSelector = formValueSelector('editProject');
  const visibleProjectName = formSelector(state, 'name') as string | undefined;
  return {
    isProjectNameEdited:
      !!visibleProjectName &&
      visibleProjectName !== ownProps.initialValues.name,
    projectVisibilityRequestInProgress: Requests.selectors.isSettingVisibilityForProject(
      state,
      ownProps.initialValues.id,
    ),
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<any>,
): GeneratedDispatchProps => {
  return {
    setProjectVisibility: (id: string, isPublic: boolean) => {
      dispatch(Projects.actions.setProjectVisibility(id, isPublic));
    },
  };
};

export default reduxForm({
  // redux-form only handles changing the name and description. Visibility
  // setting is done as soon as the value changes.
  form: 'editProject',
  validate,
  onSubmit: onSubmitPromiseCreator(
    Projects.actions.EDIT_PROJECT,
    Requests.actions.Projects.EditProject.SUCCESS.type,
    Requests.actions.Projects.EditProject.FAILURE.type,
  ),
})(
  connect<GeneratedStateProps, GeneratedDispatchProps, Props>(
    mapStateToProps,
    mapDispatchToProps,
  )(ProjectSettingsForm),
);
