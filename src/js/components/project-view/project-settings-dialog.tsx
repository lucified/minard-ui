import * as React from 'react';
import * as Icon from 'react-fontawesome';
import * as ModalDialog from 'react-modal';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { isFetchError } from '../../modules/errors';
import Modal, { ModalType } from '../../modules/modal';
import Projects, { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import confirm from '../common/confirm';
import ProjectSettingsForm from './project-settings-form';

const styles = require('../common/modal-dialog.scss');

interface PassedProps {
  project: Project;
}

interface GeneratedStateProps {
  isOpen: boolean;
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

const confirmDeletion = (project: Project) => {
  return (e: any) => {
    e.preventDefault();
    confirm(`Are you sure you want to delete ${project.name}? This action can't be undone`)
      .then(() => console.log('will delete'))
      .catch(() => {}); // tslint:disable-line
  };
};

const ProjectSettingsDialog = ({ project, isOpen, closeDialog, existingProjectNames }: Props) => (
  <ModalDialog
    isOpen={isOpen}
    onRequestClose={closeDialog}
    className={styles.dialog}
    overlayClassName={styles.overlay}
  >
    <div onClick={closeDialog} className={styles.close}>
      <Icon name="times-circle" size="4x" />
    </div>
    <h1>Project settings</h1>
    <ProjectSettingsForm
      existingProjectNames={existingProjectNames}
      onSubmitSuccess={closeDialog}
      initialValues={project}
    />
    <a className={styles.delete} onClick={confirmDeletion(project)}>
      Delete project
    </a>
  </ModalDialog>
);

const mapStateToProps = (state: StateTree, ownProps: PassedProps) => ({
  isOpen: Modal.selectors.isModalOpenOfType(state, ModalType.ProjectSettings),
  existingProjectNames: Projects.selectors.getProjects(state)
    .filter(projectOrError => !isFetchError(projectOrError))
    .filter(project => (project as Project).name !== ownProps.project.name) // filter out own name
    .map(project => (project as Project).name),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  closeDialog: () => dispatch(Modal.actions.closeModal(ModalType.ProjectSettings)),
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectSettingsDialog);
