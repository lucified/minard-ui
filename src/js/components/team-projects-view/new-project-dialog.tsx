import * as React from 'react';
import * as ModalDialog from 'react-modal';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Field, BaseFieldProps, FormProps, reduxForm } from 'redux-form';

import Modal, { ModalType } from '../../modules/modal';

const styles = require('../common/modal-dialog.scss');

interface PassedProps {
  isOpen: boolean;
}

interface GeneratedStateProps {

}

interface GeneratedDispatchProps {
  closeDialog: () => void;
}

interface FormData {
  name?: string;
  description?: string;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps & FormProps<FormData, any>;

const validate = (values: FormData) => {
  const errors: FormData = {};
  const projectNameRegex = /^[a-z0-9\-]+$/;

  if (!values.name) {
    errors.name = 'Required';
  } else if (!projectNameRegex.test(values.name)) {
    errors.name = 'Only lower-case letters, numbers and dashes allowed.'
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

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  closeDialog: () => dispatch(Modal.actions.closeModal(ModalType.NewProject)),
});

export default reduxForm({
  form: 'newProject',  // a unique identifier for this form
  validate,
})(
  connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
    () => ({}),
    mapDispatchToProps,
  )(NewProjectDialog)
);
