import * as React from 'react';
import * as ModalDialog from 'react-modal';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Field, BaseFieldProps, FormProps, reduxForm } from 'redux-form';

import Modal, { ModalType } from '../../modules/modal';
import Projects, { Project } from '../../modules/projects';
import { isError } from '../../modules/errors';
import { StateTree } from '../../reducers';

const styles = require('../common/modal-dialog.scss');

interface PassedProps {
  isOpen: boolean;
}

interface GeneratedStateProps {
  existingProjectNames: string[];
}

interface GeneratedDispatchProps {
  closeDialog: () => void;
}

interface FormData {
  name?: string;
  description?: string;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps & FormProps<FormData, any>;

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

  return errors;
};

const RenderField = ({ input, name, label, placeholder, type, meta: { touched, error }}: BaseFieldProps) => (
  <div className="row">
    <div className="col-xs-4">
      <label htmlFor={name}>{label}</label>
    </div>
    <div className="col-xs-8">
      <input {...input} placeholder={placeholder} type={type} />
      {touched && error && <span className={styles.error}>{error}</span>}
    </div>
  </div>
);

class NewProjectDialog extends React.Component<Props, any> {
  public render() {
    const { isOpen, closeDialog, handleSubmit, pristine, submitting } = this.props;
    return (
      <ModalDialog
        isOpen={isOpen}
        onRequestClose={closeDialog}
        className={styles.dialog}
        overlayClassName={styles.overlay}
      >
        <h1>Create a new project</h1>
        <form onSubmit={handleSubmit}>
          <Field name="name" component={RenderField} type="text" label="Name" placeholder="my-project-name" />
          <Field name="description" component={RenderField} type="textarea" label="Description" placeholder="Describe your project" />
          <div className="row">
            <div className="col-xs-12">
              <button type="submit" disabled={pristine || submitting}>Create project</button>
            </div>
          </div>
        </form>
      </ModalDialog>
    );
  }
};

const mapStateToProps = (state: StateTree) => ({
  existingProjectNames: Projects.selectors.getProjects(state)
    .filter(projectOrError => !isError(projectOrError))
    .map(project => (project as Project).name),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  closeDialog: () => dispatch(Modal.actions.closeModal(ModalType.NewProject)),
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(
  reduxForm({
    form: 'newProject',  // a unique identifier for this form
    validate,
  })(NewProjectDialog)
);
