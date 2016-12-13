import * as React from 'react';
import * as Icon from 'react-fontawesome';
import * as ModalDialog from 'react-modal';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';

import { isFetchError } from '../../modules/errors';
import Modal, { ModalType } from '../../modules/modal';
import Projects, { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import NewProjectForm from './new-project-form';

const styles = require('../common/forms/modal-dialog.scss');

interface PassedProps {

}

interface InjectedProps {
  router: ReactRouter.RouterOnContext;
}

interface GeneratedStateProps {
  isOpen: boolean;
  existingProjects: Project[];
}

interface GeneratedDispatchProps {
  closeDialog: (e?: React.MouseEvent<HTMLElement>) => void;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps & InjectedProps;

class NewProjectDialog extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);

    this.onSuccessfulCreation = this.onSuccessfulCreation.bind(this);
  }

  public componentWillMount() {
    // We need to mount the modal onto our App component so that
    // the overlay covers the whole app
    (ModalDialog as any).setAppElement('#minard-app');
  }

  private onSuccessfulCreation(result: any) {
    const project = result as Project;
    const intercom = (window as any).Intercom;
    if (intercom) {
      intercom('trackEvent', 'project-created');
    }

    this.props.closeDialog();
    this.props.router.push(`/project/${project.id}`);
  }

  public render() {
    const { isOpen, closeDialog, existingProjects } = this.props;

    return (
      <ModalDialog
        isOpen={isOpen}
        onRequestClose={closeDialog}
        closeTimeoutMS={150}
        className={styles.dialog}
        overlayClassName={styles.overlay}
      >
        <header className={styles.header}>
          <div>Create a new project</div>
          <div onClick={closeDialog} className={styles.close}>
            <Icon name="times" />
          </div>
        </header>
        <NewProjectForm
          existingProjects={existingProjects}
          onSubmitSuccess={this.onSuccessfulCreation}
          closeDialog={closeDialog}
        />
      </ModalDialog>
    );
  }
};

const mapStateToProps = (state: StateTree) => ({
  isOpen: Modal.selectors.isModalOpenOfType(state, ModalType.NewProject),
  existingProjects: Projects.selectors.getProjects(state)
    .filter(projectOrError => !isFetchError(projectOrError)) as Project[],
});

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  closeDialog: (e?: React.MouseEvent<HTMLElement>) => {
    if (e) {
      e.preventDefault();
    }

    dispatch(Modal.actions.closeModal(ModalType.NewProject));
  },
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(NewProjectDialog));
