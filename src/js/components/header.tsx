// tslint:disable:jsx-self-close

import * as classNames from 'classnames';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';

import Errors, { FetchCollectionError } from '../modules/errors';
import Modal, { ModalType } from '../modules/modal';
import Streaming, { ConnectionState } from '../modules/streaming';
import User, { Team } from '../modules/user';
import { StateTree } from '../reducers';
import MinardLink from './common/minard-link';

import AccountDialog from './account-dialog';
import Avatar from './common/avatar';
import ToggleMenu from './common/toggle-menu';
import InviteTeamDialog from './invite-team-dialog';

const styles = require('./header.scss');
const errorImage = require('../../images/icon-no-network.svg');
const minardLogo = require('../../images/minard-logo.svg');

interface PassedProps {

}

interface GeneratedStateProps {
  errors: FetchCollectionError[];
  connectionState: ConnectionState;
  isUserLoggedIn: boolean;
  userEmail?: string;
  team?: Team;
}

interface GeneratedDispatchProps {
  logout: () => void;
  openInviteTeamDialog: (e: React.MouseEvent<HTMLElement>) => void;
  openAccountDialog: (e: React.MouseEvent<HTMLElement>) => void;
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
    this.props.logout();
  }

  public render() {
    const {
      errors,
      connectionState,
      isUserLoggedIn,
      userEmail,
      team,
      openInviteTeamDialog,
      openAccountDialog,
    } = this.props;

    if (!isUserLoggedIn) {
      return (
        <section className={styles['header-background']}>
          <div className="container-fluid">
            <div className={classNames(styles.header, 'row', 'between-l', 'middle-xs')}>
              <div className={classNames(styles.logo, 'col-xs')}>
                <MinardLink homepage>
                  <img src={minardLogo} />
                </MinardLink>
              </div>
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
        <div className={errorClass} key="error-dialog">
          <img className={styles['error-image']} src={errorImage} />
          {errorContent}
        </div>
      );
    }

    return (
      <section className={styles['header-background']}>
        <CSSTransitionGroup
          transitionName="error-box"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {error}
        </CSSTransitionGroup>
        <InviteTeamDialog invitationToken={team && team.invitationToken} />
        <AccountDialog email={userEmail!} />
        <div className="container-fluid">
          <div className={classNames(styles.header, 'row', 'between-l', 'middle-xs')}>
            <div className={classNames(styles.logo, 'col-xs')}>
              <MinardLink homepage>
                <img src={minardLogo} />
              </MinardLink>
            </div>
            <div className={classNames(styles['profile-container'], 'col-xs')}>
              {team && (
                <ToggleMenu
                  label={team.name}
                  icon={<Avatar size="lg" email={userEmail} />}
                  className={styles['team-dropdown']}
                >
                  {/* TODO: find a better way to make the whole div clickable than the empty span trick below */}
                  <a href="#" onClick={openAccountDialog}><span className={styles.cover}></span>Account</a>
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
  return {
    errors: Errors.selectors.getFetchCollectionErrors(state),
    connectionState: Streaming.selectors.getConnectionState(state),
    isUserLoggedIn: User.selectors.isUserLoggedIn(state),
    userEmail: User.selectors.getUserEmail(state),
    team: User.selectors.getTeam(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  logout: () => { dispatch(User.actions.logout()); },
  openInviteTeamDialog: (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(Modal.actions.openModal(ModalType.InviteTeam));
  },
  openAccountDialog: (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(Modal.actions.openModal(ModalType.Account));
  },
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
