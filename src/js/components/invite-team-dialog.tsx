import * as React from 'react';
import Icon = require('react-fontawesome');
import * as ModalDialog from 'react-modal';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Modal, { ModalType } from '../modules/modal';
import { StateTree } from '../reducers';

const styles = require('./common/forms/modal-dialog.scss');

interface PassedProps {
  invitationToken?: string;
}

interface GeneratedStateProps {
  isOpen: boolean;
}

interface GeneratedDispatchProps {
  closeDialog: (e?: MouseEvent | KeyboardEvent | React.MouseEvent<HTMLElement>) => void;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps;

function getParentElement() {
  return document.querySelector('#minard-app') as HTMLElement;
}

class NewProjectDialog extends React.Component<Props, void> {
  public render() {
    const { isOpen, closeDialog, invitationToken } = this.props;

    return (
      <ModalDialog
        isOpen={isOpen}
        onRequestClose={closeDialog}
        closeTimeoutMS={150}
        className={styles.dialog}
        overlayClassName={styles.overlay}
        parentSelector={getParentElement}
        contentLabel="Invite team members"
      >
        <header className={styles.header}>
          <div>Invite your team</div>
          <div onClick={closeDialog} className={styles.close}>
            <Icon name="times" />
          </div>
        </header>
        <p>
          Get your team onboard by sharing the following signup URL with them:
        </p>
        <pre>
          {
            `${window.location.protocol}//${window.location.hostname}` +
              (window.location.port !== '80' ? `:${window.location.port}` : '') +
              `/signup/${invitationToken}`
          }
        </pre>
        <p>
          <strong>Be careful where you share this URL! </strong>
          Anyone can join your team using it.
        </p>
      </ModalDialog>
    );
  }
}

const mapStateToProps = (state: StateTree): GeneratedStateProps => ({
  isOpen: Modal.selectors.isModalOpenOfType(state, ModalType.InviteTeam),
});

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  closeDialog: (e?: MouseEvent | KeyboardEvent | React.MouseEvent<HTMLElement>) => {
    if (e) {
      e.preventDefault();
    }

    dispatch(Modal.actions.closeModal(ModalType.InviteTeam));
  },
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(NewProjectDialog);
