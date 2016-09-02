import * as React from 'react';
import * as Icon from 'react-fontawesome';
import * as ModalDialog from 'react-modal';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';

import Errors, { DeleteError, isFetchError } from '../../modules/errors';
import Modal, { ModalType } from '../../modules/modal';
import Projects, { Project } from '../../modules/projects';
import Requests from '../../modules/requests';
import { StateTree } from '../../reducers';

import confirm from '../common/confirm';
import ProjectSettingsForm from './project-settings-form';

const styles = require('../common/modal-dialog.scss');

interface PassedProps {
  project: Project;
}

interface InjectedProps {
  router: ReactRouter.RouterOnContext;
}

interface GeneratedStateProps {
  isOpen: boolean;
  existingProjectNames: string[];
  deletionInProgress: boolean;
  deletionError?: DeleteError;
}

interface GeneratedDispatchProps {
  closeDialog: () => void;
  deleteProject: (id: string, resolve: () => void, reject: () => void) => void;
  clearDeletionErrors: () => void;
}

interface FormData {
  name?: string;
  description?: string;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps & InjectedProps;

class ProjectSettingsDialog extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);

    this.confirmDeletion = this.confirmDeletion.bind(this);
    this.clearAndClose = this.clearAndClose.bind(this);
  }

  private confirmDeletion(e: any) {
    e.preventDefault();

    const { project, deleteProject, closeDialog, router } = this.props;

    confirm(`Are you sure you want to delete ${project.name}? ` +
      'This action will remove the project, repository and all previews.')
      .then(() => new Promise((resolve, reject) => {
          deleteProject(project.id, resolve, reject);
        })
      )
      .then(() => {
        this.clearAndClose();
        router.push('/projects');
      })
      .catch(() => {}); // tslint:disable-line
  };

  private clearAndClose() {
    this.props.clearDeletionErrors();
    this.props.closeDialog();
  }

  public render() {
    const { project, isOpen, deletionInProgress, deletionError, existingProjectNames } = this.props;

    return (
      <ModalDialog
        isOpen={isOpen}
        onRequestClose={this.clearAndClose}
        className={styles.dialog}
        overlayClassName={styles.overlay}
      >
        <div onClick={this.clearAndClose} className={styles.close}>
          <Icon name="times-circle" size="4x" />
        </div>
        <h1>Project settings</h1>
        <ProjectSettingsForm
          existingProjectNames={existingProjectNames}
          onSubmitSuccess={this.clearAndClose}
          initialValues={project}
        />
        <h3 className={styles['delete-section']}>Delete project</h3>
        <div>
          Deleting the project will also delete the git repository. This action cannot be undone.
          You have been warned.
        </div>
        {deletionInProgress ? (
          <div className={styles.deleting}>Deleting...</div>
        ) : (
          <div className={styles.delete}>
            <a onClick={this.confirmDeletion}>
              Delete project
            </a>
            {deletionError && <div className={styles.error}>{deletionError.prettyError}</div>}
          </div>
        )}
      </ModalDialog>
    );
  }
}

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedStateProps => {
  const { project } = ownProps;

  return {
    isOpen: Modal.selectors.isModalOpenOfType(state, ModalType.ProjectSettings),
    existingProjectNames: Projects.selectors.getProjects(state)
      .filter(projectOrError => !isFetchError(projectOrError))
      .filter(otherProject => (otherProject as Project).name !== project.name) // filter out own name
      .map(otherProject => (otherProject as Project).name),
    deletionInProgress: Requests.selectors.isDeletingProject(state, project.id),
    deletionError: Errors.selectors.getProjectDeletionError(state, project.id),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  closeDialog: () => dispatch(Modal.actions.closeModal(ModalType.ProjectSettings)),
  deleteProject: (id, resolve, reject) => dispatch(Projects.actions.deleteProjectPromiseResolver(id, resolve, reject)),
  clearDeletionErrors: () => dispatch(Errors.actions.clearProjectDeletionErrors()),
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ProjectSettingsDialog));
