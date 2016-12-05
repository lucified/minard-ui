import * as React from 'react';
import * as Icon from 'react-fontawesome';
import * as ModalDialog from 'react-modal';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';

import { logException } from '../../logger';
import Errors, { DeleteError, isFetchError } from '../../modules/errors';
import Modal, { ModalType } from '../../modules/modal';
import Projects, { Project } from '../../modules/projects';
import Requests from '../../modules/requests';
import { StateTree } from '../../reducers';

import ProjectSettingsForm from './project-settings-form';

const styles = require('../common/forms/modal-dialog.scss');

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
  closeDialog: (e?: any) => void;
  deleteProject: (id: string, resolve: () => void, reject: () => void) => void;
  clearDeletionErrors: () => void;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps & InjectedProps;

class ProjectSettingsDialog extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);

    this.deleteProject = this.deleteProject.bind(this);
    this.clearAndClose = this.clearAndClose.bind(this);
    this.editSuccess = this.editSuccess.bind(this);
  }

  public componentWillMount() {
    // We need to mount the modal onto our App component so that
    // the overlay covers the whole app
    (ModalDialog as any).setAppElement('#minard-app');
  }

  private deleteProject() {
    const { project, deleteProject, router } = this.props;

    new Promise((resolve, reject) => {
      deleteProject(project.id, resolve, reject);
    })
    .then(() => {
      const intercom = (window as any).Intercom;
      if (intercom) {
        intercom('trackEvent', 'project-deleted');
      }

      this.clearAndClose();
      router.push('/projects');
    })
    .catch((e) => {
      logException('Error deleting project:', e, { project });
    });
  };

  private clearAndClose() {
    this.props.clearDeletionErrors();
    this.props.closeDialog();
  }

  private editSuccess() {
    const intercom = (window as any).Intercom;
    if (intercom) {
      intercom('trackEvent', 'project-edited');
    }

    this.clearAndClose();
  }

  public render() {
    const { project, isOpen, deletionInProgress, deletionError, existingProjectNames } = this.props;

    return (
      <ModalDialog
        isOpen={isOpen}
        onRequestClose={this.clearAndClose}
        closeTimeoutMS={150}
        className={styles.dialog}
        overlayClassName={styles.overlay}
      >
        <header className={styles.header}>
          <div>Project settings</div>
          <div onClick={this.clearAndClose} className={styles.close}>
            <Icon name="times" />
          </div>
        </header>
        <ProjectSettingsForm
          existingProjectNames={existingProjectNames}
          onSubmitSuccess={this.editSuccess}
          initialValues={project}
          closeDialog={this.clearAndClose}
          deletionInProgress={deletionInProgress}
          deletionError={deletionError}
          deleteProject={this.deleteProject}
        />
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
  closeDialog: (_e?: any) => {
    dispatch(Modal.actions.closeModal(ModalType.ProjectSettings));
  },
  deleteProject: (id, resolve, reject) => {
    dispatch(Projects.actions.deleteProjectPromiseResolver(id, resolve, reject));
  },
  clearDeletionErrors: () => {
    dispatch(Errors.actions.clearProjectDeletionErrors());
  },
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ProjectSettingsDialog));
