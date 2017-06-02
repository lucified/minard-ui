import * as classNames from 'classnames';
import * as React from 'react';
import * as Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Field, FormProps, reduxForm, WrappedFieldProps } from 'redux-form';

import { onSubmitPromiseCreator } from '../../modules/forms';
import Projects, {
  CreateProjectFormData,
  Project,
} from '../../modules/projects';
import Requests from '../../modules/requests';

import FormField from '../common/forms/field';

const styles = require('../common/forms/modal-dialog.scss');

interface PassedProps {
  existingProjects: Project[];
  // This is used to pass in the team ID
  initialValues?: any;
  onSubmitSuccess: (projectId: string) => void;
  closeDialog: (e: React.MouseEvent<HTMLElement>) => void;
}

type Props = PassedProps & FormProps<CreateProjectFormData, PassedProps, void>;

const validate = (values: CreateProjectFormData, props: Props) => {
  const errors: Partial<CreateProjectFormData> = {};
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
  } else if (props.existingProjects.find(project => project.name === name)) {
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

class NewProjectForm extends React.Component<Props, void> {
  constructor(props: Props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  private handleCancel(e: React.MouseEvent<HTMLElement>) {
    const { submitting, closeDialog } = this.props;

    if (!submitting) {
      closeDialog(e);
    }
  }

  public render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      error,
      invalid,
      existingProjects,
    } = this.props;
    const dropdownValues = existingProjects
      .sort((a, b) => {
        if (a.latestActivityTimestamp === undefined) {
          return -1;
        }

        if (b.latestActivityTimestamp === undefined) {
          return 1;
        }

        return b.latestActivityTimestamp - a.latestActivityTimestamp;
      })
      .map(project => ({ value: project.id, label: project.name }));

    return (
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          {error &&
            <div className={styles['general-error']}>
              {error}
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
        </div>
        <footer className={styles.footer}>
          <div>
            <a
              className={classNames(styles.cancel, {
                [styles['disabled-link']]: submitting,
              })}
              onClick={this.handleCancel}
            >
              Cancel
            </a>

            <button
              type="submit"
              className={styles.submit}
              disabled={pristine || submitting || invalid}
            >
              {submitting ? 'Creating...' : 'Create project'}
            </button>
          </div>
          {/* TODO: don't inline function below */}
          {dropdownValues.length > 0 &&
            <div>
              <Field
                name="projectTemplate"
                component={(field: WrappedFieldProps<void>) =>
                  <Select
                    value={field.input && field.input.value}
                    onChange={field.input && field.input.onChange}
                    onBlur={() =>
                      field.input && field.input.onBlur(field.input.value)}
                    options={dropdownValues}
                    placeholder="Clone existing project…"
                    autosize={false}
                    disabled={(field.meta as any).submitting}
                    className={styles['template-dropdown']}
                    simpleValue
                  /> /* tslint:disable-line:jsx-no-lambda */}
              />
            </div>}
        </footer>
      </form>
    );
  }
}

export default reduxForm({
  form: 'newProject',
  validate,
  onSubmit: onSubmitPromiseCreator(
    Projects.actions.CREATE_PROJECT,
    Requests.actions.Projects.CreateProject.SUCCESS.type,
    Requests.actions.Projects.CreateProject.FAILURE.type,
  ),
})(NewProjectForm);
