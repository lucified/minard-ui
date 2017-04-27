import * as classNames from 'classnames';
import * as React from 'react';
import Icon = require('react-fontawesome');
import * as ModalDialog from 'react-modal';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Modal, { ModalType } from '../modules/modal';
import { StateTree } from '../reducers';

const modalStyles = require('./common/forms/modal-dialog.scss');
const styles = require('./invite-team-dialog.scss');

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

function selectText(e: React.MouseEvent<HTMLElement>) {
  const node = e.target;
  const doc = document as any;

  if (doc.selection) {
    const range = doc.body.createTextRange();
    range.moveToElementText(node);
    range.select();
  } else if (window.getSelection) {
    const range = document.createRange();
    range.selectNodeContents(node as Node);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }
}

class NewProjectDialog extends React.Component<Props, void> {
  public render() {
    const { isOpen, closeDialog, invitationToken } = this.props;

    return (
      <ModalDialog
        isOpen={isOpen}
        onRequestClose={closeDialog}
        closeTimeoutMS={150}
        className={modalStyles.dialog}
        overlayClassName={modalStyles.overlay}
        parentSelector={getParentElement}
        contentLabel="Invite team members"
      >
        <header className={modalStyles.header}>
          <div>Invite your team</div>
          <div onClick={closeDialog} className={modalStyles.close}>
            <Icon name="times" />
          </div>
        </header>
        <div className={classNames(modalStyles.form, styles.instructions)}>
          <p>Get your team onboard by sharing this signup URL with them:</p>
          <div className={styles.url}>
            <pre onClick={selectText}>
              {
                `${window.location.protocol}//${window.location.hostname}` +
                  (window.location.port !== '80' ? `:${window.location.port}` : '') +
                  `/signup/${invitationToken}`
              }
            </pre>
          </div>
          <p>
            <strong>Be mindful of where you share this URL!</strong><br />
            Anyone can join your team with it.
          </p>
        </div>
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
