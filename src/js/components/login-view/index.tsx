import { Auth0Error, Auth0UserProfile } from 'auth0-js';
import Auth0Lock from 'auth0-lock';
import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';

import { clearStoredCredentials, storeCredentials } from '../../api/auth';
import { login as intercomLogin } from '../../intercom';
import Requests from '../../modules/requests';
import User, { Team } from '../../modules/user';
import { StateTree } from '../../reducers';
import ErrorDialog from '../common/error-dialog';
import Spinner from '../common/spinner';

const minardLogo = require('../../../../static/minard-logo-auth0.png');
const styles = require('./index.scss');
const headerStyles = require('../header.scss');

interface GeneratedStateProps {
  isLoadingTeamInformation: boolean;
  team?: Team;
}

interface GeneratedDispatchProps {
  navigateTo: (url: string) => void;
  setUserEmail: (email: string, expiresIn: number) => void;
  loadTeamInformation: () => void;
}

interface PassedProps {
  params: {
    returnPath?: string;
  };
}

type Props = GeneratedStateProps & GeneratedDispatchProps & PassedProps;

interface State {
  loadingStatus: LoadingStatus;
}

enum LoadingStatus {
  AUTH0,
  BACKEND,
}

class LoginView extends React.Component<Props, State> {
  private lock: Auth0LockStatic;

  constructor(props: Props) {
    super(props);

    this.state = {
      loadingStatus: LoadingStatus.AUTH0,
    };
  }

  public componentDidMount() {
    // Remove stored credentials. E.g. if there is an old access token stored that
    // has expired.
    clearStoredCredentials();

    this.lock = new Auth0Lock(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN, {
      // oidcConformant is still in preview stage, which is why it is not documented
      // or found in the typings. Remove the `as any` below once it's included.
      // Read more: https://auth0.com/forum/t/lock-not-always-passing-audience/5121/17
      oidcConformant: true,
      auth: {
        responseType: 'token',
        params: {
          scope: 'openid email', // TODO: get real name once we can (somehow)
          audience: process.env.AUTH0_AUDIENCE,
        },
      },
      allowSignUp: false,
      allowedConnections: [
        'Username-Password-Authentication',
      ],
      closable: false,
      container: 'login-container',
      theme: {
        logo: minardLogo,
        primaryColor: '#40C1AC',
      },
      languageDictionary: {
        title: 'Minard by Lucify',
      },
    } as any);

    this.lock.on('authenticated', this.onAuthentication.bind(this));
    this.lock.on('authorization_error', this.onError.bind(this));
    this.lock.on('unrecoverable_error', this.onError.bind(this));
    this.lock.show();
  }

  private onError(error: Auth0Error) {
    console.error('Unable to login', error);
    // TODO: handle this
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { navigateTo, params: { returnPath } } = this.props;

    if (nextProps.team) {
      // For raw deployment URLs
      if (returnPath && returnPath.match(/^https?:\/\//)) {
        window.location.href = returnPath;
        return;
      }

      navigateTo(returnPath || '/');
    }
  }

  private onAuthentication(authResult: any) {
    const { loadTeamInformation, setUserEmail } = this.props;
    const { idToken, accessToken, expiresIn } = authResult;

    this.lock.getUserInfo(accessToken, (error: Auth0Error, profile: Auth0UserProfile) => {
      if (error) {
        console.error('Unable to get user information', error);
        // TODO: handle this

        return;
      }

      const { email } = profile;
      if (email) {
        // expiresIn is seconds from now
        const expiresAt = moment().add(expiresIn, 'seconds').valueOf();

        intercomLogin(email);
        storeCredentials(idToken, accessToken, email, expiresAt);
        setUserEmail(email, expiresAt);

        loadTeamInformation();
        this.lock.hide();
        this.setState({ loadingStatus: LoadingStatus.BACKEND });
      } else {
        console.error('No email address returned from Auth0!', profile);
        // TODO: handle this
      }
    });
  }

  private restartLogin() {
    clearStoredCredentials();
    window.location.href = '/login';
  }

  // TODO: Make the Header component support this usage
  private getHeader() {
    return (
      <section className={headerStyles['header-background']}>
        <div className={classNames(headerStyles.header, 'row', 'between-xs', 'middle-xs')}>
          <div className={classNames(headerStyles.logo, 'col-xs')}>
            <h1 title="Minard" className={headerStyles.minard}>m</h1>
          </div>
        </div>
      </section>
    );
  }

  public render() {
    const { loadingStatus } = this.state;
    const { team, isLoadingTeamInformation } = this.props;

    if (loadingStatus === LoadingStatus.BACKEND) {
      if (!team && !isLoadingTeamInformation) {
        return (
          <div>
            {this.getHeader()}
            <ErrorDialog title="Error" actionText="Try again" action={this.restartLogin}>
              <p>
                Unable to fetch team information.
              </p>
            </ErrorDialog>
          </div>
        );
      }

      return (
        <div>
          {this.getHeader()}
          <Spinner />
        </div>
      );
    }

    return (
      <div className={styles.root}>
        <div className={styles['login-container']} id="login-container" />
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree): GeneratedStateProps => ({
  isLoadingTeamInformation: Requests.selectors.isLoadingTeamInformation(state),
  team: User.selectors.getTeam(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  navigateTo: (url: string) => { dispatch(push(url)); },
  setUserEmail: (email: string, expiresAt: number) => { dispatch(User.actions.setUserEmail(email, expiresAt)); },
  loadTeamInformation: () => { dispatch(User.actions.loadTeamInformation()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
