import * as React from 'react';
import Icon = require('react-fontawesome');
import * as ModalDialog from 'react-modal';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Dispatch } from 'redux';

import { trackEvent } from '../../intercom';
import { isFetchError } from '../../modules/errors';
import Modal, { ModalType } from '../../modules/modal';
import Projects, { Project } from '../../modules/projects';
import User, { Team } from '../../modules/user';
import { StateTree } from '../../reducers';

import NewProjectForm from './new-project-form';

const styles = require('../common/forms/modal-dialog.scss');

interface PassedProps {}

interface GeneratedStateProps {
  isOpen: boolean;
  team?: Team;
  existingProjects: Project[];
}

interface GeneratedDispatchProps {
  closeDialog: (
    e?: MouseEvent | KeyboardEvent | React.MouseEvent<HTMLElement>,
  ) => void;
  redirectToProject: (project: Project) => void;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps;

function getParentElement() {
  return document.querySelector('#minard-app') as HTMLElement;
}

class NewProjectDialog extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.onSuccessfulCreation = this.onSuccessfulCreation.bind(this);
  }

  private onSuccessfulCreation(result: any) {
    const project = result as Project;
    trackEvent('project-created');

    this.props.closeDialog();
    this.props.redirectToProject(project);
  }

  public render() {
    const { isOpen, closeDialog, existingProjects, team } = this.props;

    return (
      <ModalDialog
        isOpen={isOpen}
        onRequestClose={closeDialog}
        closeTimeoutMS={150}
        className={styles.dialog}
        overlayClassName={styles.overlay}
        parentSelector={getParentElement}
        contentLabel="Create new project"
      >
        <header className={styles.header}>
          <div>Create a new project</div>
          <div onClick={closeDialog} className={styles.close}>
            <Icon name="times" />
          </div>
        </header>
        <NewProjectForm
          existingProjects={existingProjects}
          initialValues={{ teamId: team!.id }}
          onSubmitSuccess={this.onSuccessfulCreation}
          closeDialog={closeDialog}
        />
      </ModalDialog>
    );
  }
}

const mapStateToProps = (state: StateTree) => ({
  isOpen: Modal.selectors.isModalOpenOfType(state, ModalType.NewProject),
  team: User.selectors.getTeam(state),
  existingProjects: Projects.selectors
    .getProjects(state)
    .filter(projectOrError => !isFetchError(projectOrError)) as Project[],
});

const mapDispatchToProps = (
  dispatch: Dispatch<any>,
): GeneratedDispatchProps => ({
  closeDialog: (
    e?: MouseEvent | KeyboardEvent | React.MouseEvent<HTMLElement>,
  ) => {
    if (e) {
      e.preventDefault();
    }

    dispatch(Modal.actions.closeModal(ModalType.NewProject));
  },
  redirectToProject: (project: Project) => {
    dispatch(push(`/project/${project.id}`));
  },
});

export default connect<
  GeneratedStateProps,
  GeneratedDispatchProps,
  PassedProps
>(mapStateToProps, mapDispatchToProps)(NewProjectDialog);
