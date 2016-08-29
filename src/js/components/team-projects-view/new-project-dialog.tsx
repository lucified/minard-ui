import * as React from 'react';
import * as ModalDialog from 'react-modal';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Field, FormProps, reduxForm } from 'redux-form';

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
  const errors = {};
  // TODO
  return errors;
};

interface FieldCustomProps {

}

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
          <div className="row">
            <div className="col-xs-4">
              <label htmlFor="name">Name</label>
            </div>
            <div className="col-xs-8">
              <Field name="name" component="input" type="text" placeholder="my-project-name" />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-4">
              <label htmlFor="description">
                Description
              </label>
            </div>
            <div className="col-xs-8">
              <Field name="description" component="textarea" type="text" placeholder="Describe your project" />
            </div>
          </div>
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
  // validate
})(
  connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
    () => ({}),
    mapDispatchToProps,
  )(NewProjectDialog)
);
