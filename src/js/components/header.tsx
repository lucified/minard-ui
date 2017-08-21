// tslint:disable:jsx-self-close

import * as classNames from 'classnames';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';

import Modal, { ModalType } from '../modules/modal';
import User, { Team } from '../modules/user';
import { StateTree } from '../reducers';
import MinardLink from './common/minard-link';

import AccountDialog from './account-dialog';
import Avatar from './common/avatar';
import ToggleMenu from './common/toggle-menu';
import ErrorPopup from './error-popup';
import InviteTeamDialog from './invite-team-dialog';
import TeamNotificationsDialog from './team-notifications-dialog';

const styles = require('./header.scss');
const minardLogo = require('../../images/minard-logo.svg');

interface PassedProps {}

interface GeneratedStateProps {
  isUserLoggedIn: boolean;
  userEmail?: string;
  team?: Team;
}

interface GeneratedDispatchProps {
  logout: () => void;
  openInviteTeamDialog: (e: React.MouseEvent<HTMLElement>) => void;
  openAccountDialog: (e: React.MouseEvent<HTMLElement>) => void;
  openTeamNotificationsDialog: (e: React.MouseEvent<HTMLElement>) => void;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps;

class Header extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  private logout(_e: any) {
    this.props.logout();
  }

  public render() {
    const {
      isUserLoggedIn,
      userEmail,
      team,
      openInviteTeamDialog,
      openAccountDialog,
      openTeamNotificationsDialog,
    } = this.props;

    if (!isUserLoggedIn) {
      return (
        <section className={styles['header-background']}>
          <div className="container-fluid">
            <div
              className={classNames(
                styles.header,
                'row',
                'between-l',
                'middle-xs',
              )}
            >
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

    return (
      <section className={styles['header-background']}>
        <CSSTransitionGroup
          transitionName="error-box"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          <ErrorPopup />
        </CSSTransitionGroup>
        <InviteTeamDialog invitationToken={team && team.invitationToken} />
        <TeamNotificationsDialog />
        <AccountDialog email={userEmail!} />
        <div className="container-fluid">
          <div
            className={classNames(
              styles.header,
              'row',
              'between-l',
              'middle-xs',
            )}
          >
            <div className={classNames(styles.logo, 'col-xs')}>
              <MinardLink homepage>
                <img src={minardLogo} />
              </MinardLink>
            </div>
            <div className={classNames(styles['profile-container'], 'col-xs')}>
              {team &&
                <ToggleMenu
                  label={team.name}
                  icon={<Avatar size="lg" email={userEmail} />}
                  className={styles['team-dropdown']}
                >
                  {/* TODO: find a better way to make the whole div clickable than the empty span trick below */}
                  <a href="#" onClick={openAccountDialog}>
                    <span className={styles.cover} />Account
                  </a>
                  <a href="#" onClick={openTeamNotificationsDialog}>
                    <span className={styles.cover} />Notifications
                  </a>
                  <a href="#" onClick={openInviteTeamDialog}>
                    <span className={styles.cover} />Invite your team
                  </a>
                  <Link to="/login" onClick={this.logout}>
                    <span className={styles.cover} />Logout
                  </Link>
                </ToggleMenu>}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state: StateTree): GeneratedStateProps => {
  return {
    isUserLoggedIn: User.selectors.isUserLoggedIn(state),
    userEmail: User.selectors.getUserEmail(state),
    team: User.selectors.getTeam(state),
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<any>,
): GeneratedDispatchProps => ({
  logout: () => {
    dispatch(User.actions.logout());
  },
  openInviteTeamDialog: (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(Modal.actions.openModal(ModalType.InviteTeam));
  },
  openTeamNotificationsDialog: (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(Modal.actions.openModal(ModalType.TeamNotifications));
  },
  openAccountDialog: (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(Modal.actions.openModal(ModalType.Account));
  },
});

export default connect<
  GeneratedStateProps,
  GeneratedDispatchProps,
  PassedProps
>(mapStateToProps, mapDispatchToProps)(Header);
