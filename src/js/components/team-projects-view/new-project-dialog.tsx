import * as React from 'react';
import * as ModalDialog from 'react-modal';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { isError } from '../../modules/errors';
import Modal, { ModalType } from '../../modules/modal';
import Projects, { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import NewProjectForm from './new-project-form';

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

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps;

class NewProjectDialog extends React.Component<Props, any> {
  public render() {
    const { isOpen, closeDialog, existingProjectNames } = this.props;

    return (
      <ModalDialog
        isOpen={isOpen}
        onRequestClose={closeDialog}
        className={styles.dialog}
        overlayClassName={styles.overlay}
      >
        <h1>Create a new project</h1>
        <NewProjectForm existingProjectNames={existingProjectNames} />
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
)(NewProjectDialog);
