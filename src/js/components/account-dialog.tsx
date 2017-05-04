import { Auth0Error, WebAuth } from 'auth0-js';
import * as React from 'react';
import Icon = require('react-fontawesome');
import * as ModalDialog from 'react-modal';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Modal, { ModalType } from '../modules/modal';
import { StateTree } from '../reducers';

const modalStyles = require('./common/forms/modal-dialog.scss');
const styles = require('./account-dialog.scss');

interface PassedProps {
  email: string;
}

interface GeneratedStateProps {
  isOpen: boolean;
}

interface GeneratedDispatchProps {
  closeDialog: (e?: MouseEvent | KeyboardEvent | React.MouseEvent<HTMLElement>) => void;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps;

interface State {
  error?: string;
  passwordChangeTriggered: boolean;
}

function getParentElement() {
  return document.querySelector('#minard-app') as HTMLElement;
}

const selectText = (e: React.MouseEvent<HTMLElement>) => {
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
};

class AccountDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      passwordChangeTriggered: false,
    };

    this.requestResetPassword = this.requestResetPassword.bind(this);
  }

  private auth0?: WebAuth;

  public componentDidMount() {
    this.auth0 = new WebAuth({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      audience: process.env.AUTH0_AUDIENCE,
    });
  }

  public componentWillReceiveProps(newProps: Props) {
    // Reset the state once the dialog is closed.
    if (newProps.isOpen !== this.props.isOpen && !newProps.isOpen) {
      this.setState({ passwordChangeTriggered: false });
    }
  }

  private requestResetPassword(_e: React.MouseEvent<HTMLElement>) {
    const { email } = this.props;

    if (this.auth0) {
      this.auth0.changePassword({
        connection: 'Username-Password-Authentication',
        email,
      }, (error: Auth0Error, _response: any) => {
        if (error) {
          console.error('Authorization error:', error);
          this.setState({ error: error.description, passwordChangeTriggered: false });
        } else {
          this.setState({ passwordChangeTriggered: true, error: undefined });
        }
      });
    } else {
      console.error('Auth0 not initialized!');
      this.setState({ error: 'Unable to initialize Auth0' });
    }
  }

  public render() {
    const { isOpen, closeDialog, email } = this.props;
    const { error, passwordChangeTriggered } = this.state;

    return (
      <ModalDialog
        isOpen={isOpen}
        onRequestClose={closeDialog}
        closeTimeoutMS={150}
        className={modalStyles.dialog}
        overlayClassName={modalStyles.overlay}
        parentSelector={getParentElement}
        contentLabel="Account"
      >
        <header className={modalStyles.header}>
          <div>Account</div>
          <div onClick={closeDialog} className={modalStyles.close}>
            <Icon name="times" />
          </div>
        </header>
        <div className={styles.instructions}>
          <div className={styles.section}>
            <div className={styles.label}>
              Email address
            </div>
            <div className={styles.text}>
              <p>
                Your account's email address is <strong onClick={selectText}>{email}</strong>
              </p>
              <p>
                To change your Minard email address, please
                contact <a className={styles.url} href="mailto:support@minard.io">support@minard.io</a>.
              </p>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.label}>
              Password
            </div>
            <div className={styles.text}>
              <button
                type="submit"
                disabled={passwordChangeTriggered}
                className={modalStyles.reset}
                onClick={this.requestResetPassword}
              >
                {passwordChangeTriggered ? 'Email sent!' : 'Reset password'}
              </button>
              <p>
                A password reset email will be sent to {email}.
              </p>
              {error && (
                <p className={styles.error}>Sorry, we had a problem problem requesting a password reset: {error}</p>
              )}
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.label}>
              Git credentials
            </div>
            <div className={styles.text}>
              <p>
                Your Git username is your email address:
                {' '}<strong onClick={selectText}>{email}</strong>
              </p>
              <p>
                For security reasons, your Git password was only shown when you signed up for Minard. If
                you wish to change your password, please
                contact <a className={styles.url} href="mailto:support@minard.io">support@minard.io</a>.
              </p>
            </div>
          </div>
        </div>
      </ModalDialog>
    );
  }
}

const mapStateToProps = (state: StateTree): GeneratedStateProps => ({
  isOpen: Modal.selectors.isModalOpenOfType(state, ModalType.Account),
});

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  closeDialog: (e?: MouseEvent | KeyboardEvent | React.MouseEvent<HTMLElement>) => {
    if (e) {
      e.preventDefault();
    }

    dispatch(Modal.actions.closeModal(ModalType.Account));
  },
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(AccountDialog);
