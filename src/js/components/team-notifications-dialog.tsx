import * as React from 'react';
import Icon = require('react-fontawesome');
import * as ModalDialog from 'react-modal';
import { connect, Dispatch } from 'react-redux';

import Modal, { ModalType } from '../modules/modal';
import Notifications, {
  isGitHubTeamNotificationConfiguration,
  NotificationConfiguration,
} from '../modules/notifications';
import { StateTree } from '../reducers';

const modalStyles = require('./common/forms/modal-dialog.scss');
const styles = require('./team-notifications-dialog.scss');

interface GeneratedStateProps {
  notifications?: NotificationConfiguration[];
  isOpen: boolean;
}

interface GeneratedDispatchProps {
  closeDialog: (
    e?: MouseEvent | KeyboardEvent | React.MouseEvent<HTMLElement>,
  ) => void;
}

type Props = GeneratedStateProps & GeneratedDispatchProps;

function getParentElement() {
  return document.querySelector('#minard-app') as HTMLElement;
}

function InviteTeamDialog({ isOpen, closeDialog, notifications }: Props) {
  const gitHubNotifications =
    notifications &&
    notifications.filter(isGitHubTeamNotificationConfiguration);

  return (
    <ModalDialog
      isOpen={isOpen}
      onRequestClose={closeDialog}
      closeTimeoutMS={150}
      className={modalStyles.dialog}
      overlayClassName={modalStyles.overlay}
      parentSelector={getParentElement}
      contentLabel="Global notifications"
    >
      <header className={modalStyles.header}>
        <div>Global notifications</div>
        <div onClick={closeDialog} className={modalStyles.close}>
          <Icon name="times" />
        </div>
      </header>
      <div className={styles.instructions}>
        {gitHubNotifications && gitHubNotifications.length > 0
          ? <div>
              <p>GitHub notifications have been set up for your team.</p>
              <p>
                <strong>App ID:</strong> {gitHubNotifications[0].githubAppId}
                <br />
                <strong>Installation ID:</strong>
                {gitHubNotifications[0].githubInstallationId}
              </p>
            </div>
          : <p>GitHub notifications have not been set up for your team.</p>}
      </div>
    </ModalDialog>
  );
}

const mapStateToProps = (state: StateTree): GeneratedStateProps => ({
  isOpen: Modal.selectors.isModalOpenOfType(state, ModalType.TeamNotifications),
  notifications: Notifications.selectors.getTeamNotificationConfigurations(
    state,
  ),
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

    dispatch(Modal.actions.closeModal(ModalType.TeamNotifications));
  },
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps,
)(InviteTeamDialog);
