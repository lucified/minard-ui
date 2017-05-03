// tslint:disable:jsx-self-close

import * as classNames from 'classnames';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router';

import { clearStoredCredentials } from '../api/auth';
import { logout as intercomLogout } from '../intercom';
import Errors, { FetchCollectionError } from '../modules/errors';
import Modal, { ModalType } from '../modules/modal';
import Selected from '../modules/selected';
import Streaming, { ConnectionState } from '../modules/streaming';
import User, { Team } from '../modules/user';
import { StateTree } from '../reducers';

import Avatar from './common/avatar';
import ToggleMenu from './common/toggle-menu';
import InviteTeamDialog from './invite-team-dialog';
import UserSettingsDialog from './user-settings-dialog';

const styles = require('./header.scss');
const errorImage = require('../../images/icon-no-network.svg');

interface PassedProps {

}

interface GeneratedStateProps {
  selectedSection: string;
  errors: FetchCollectionError[];
  connectionState: ConnectionState;
  isUserLoggedIn: boolean;
  userEmail?: string;
  team?: Team;
}

interface GeneratedDispatchProps {
  clearUserDetails: () => void;
  clearData: () => void;
  openInviteTeamDialog: (e: React.MouseEvent<HTMLElement>) => void;
  openUserSettingsDialog: (e: React.MouseEvent<HTMLElement>) => void;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps;

const reloadPage = (e: React.MouseEvent<HTMLElement>) => {
  e.preventDefault();
  e.stopPropagation();

  location.reload(true);
};

class Header extends React.Component<Props, void> {
  constructor(props: Props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  private logout(_e: any) {
    intercomLogout();
    this.props.clearData();
    this.props.clearUserDetails();
    clearStoredCredentials();
  }

  public render() {
    const {
      errors,
      selectedSection,
      connectionState,
      isUserLoggedIn,
      userEmail,
      team,
      openInviteTeamDialog,
      openUserSettingsDialog,
    } = this.props;

    if (!isUserLoggedIn) {
      return (
        <section className={styles['header-background']}>
          <div className={classNames(styles.header, 'row', 'between-xs', 'middle-xs')}>
            <div className={classNames(styles.logo, 'col-xs')}>
              <h1 title="Minard" className={styles.minard}>m</h1>
            </div>
          </div>
        </section>
      );
    }

    let error: JSX.Element | null = null;
    let errorContent: JSX.Element | null = null;
    let errorClass: string = '';
    if (errors && errors.length > 0) {
      errorClass = styles['error-box'];
      errorContent = (
        <div>
          Uhhoh, we seem to be having<br />
          connection problems.
        </div>
      );
    } else if (connectionState === ConnectionState.CLOSED) {
      errorClass = styles['error-box'];
      errorContent = (
        <div>
          Connection lost. Trying to reconnect...<br />
          <a onClick={reloadPage}>Click to reload</a>
        </div>
      );
    } else if (connectionState === ConnectionState.CONNECTING) {
      errorClass = styles['connection-box'];
      errorContent = (
        <div>
          Hold on, connecting...
        </div>
      );
    }

    if (errorContent && errorClass) {
      error = (
        <div className={errorClass}>
          <img className={styles['error-image']} src={errorImage} />
          {errorContent}
        </div>
      );
    }

    return (
      <section className={styles['header-background']}>
        {error}
        <InviteTeamDialog invitationToken={team && team.invitationToken} />
        <UserSettingsDialog email={userEmail!} />
        <div className="container">
          <div className={classNames(styles.header, 'row', 'between-xs', 'middle-xs')}>
            <div className={classNames(styles['link-container'], 'col-xs')}>
              <ul className={styles.links}>
                <Link to="/">
                  <li className={classNames(styles.link, { [styles.active]: selectedSection === 'homepage' })}>
                    Home
                  </li>
                </Link>
              </ul>
            </div>
            <div className={classNames(styles.logo, 'col-xs')}>
              <h1 title="Minard" className={styles.minard}>m</h1>
            </div>
            <div className={classNames(styles['profile-container'], 'col-xs')}>
              {team && (
                <ToggleMenu
                  label={team.name}
                  icon={<Avatar size="lg" email={userEmail} />}
                  className={styles['team-dropdown']}
                >
                  {/* TODO: find a better way to make the whole div clickable than the empty span trick below */}
                  <a href="#" onClick={openUserSettingsDialog}><span className={styles.cover}></span>Account</a>
                  <a href="#" onClick={openInviteTeamDialog}><span className={styles.cover}></span>Invite your team</a>
                  <Link to="/login" onClick={this.logout}><span className={styles.cover}></span>Logout</Link>
                </ToggleMenu>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state: StateTree): GeneratedStateProps => {
  const selectedSection =
    Selected.selectors.getSelectedBranch(state) === null &&
    Selected.selectors.getSelectedProject(state) === null &&
    !Selected.selectors.isShowingAll(state) ?
      'homepage' : 'other';

  return {
    errors: Errors.selectors.getFetchCollectionErrors(state),
    selectedSection,
    connectionState: Streaming.selectors.getConnectionState(state),
    isUserLoggedIn: User.selectors.isUserLoggedIn(state),
    userEmail: User.selectors.getUserEmail(state),
    team: User.selectors.getTeam(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  clearUserDetails: () => { dispatch(User.actions.clearUserDetails()); },
  clearData: () => { dispatch(User.actions.clearStoredData()); },
  openInviteTeamDialog: (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(Modal.actions.openModal(ModalType.InviteTeam));
  },
  openUserSettingsDialog: (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(Modal.actions.openModal(ModalType.Account));
  },
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
