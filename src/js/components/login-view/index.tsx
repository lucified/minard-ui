import { Auth0Error, Auth0UserProfile } from 'auth0-js';
import Auth0Lock from 'auth0-lock';
import * as moment from 'moment';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import Requests from '../../modules/requests';
import User from '../../modules/user';
import { StateTree } from '../../reducers';
import ErrorDialog from '../common/error-dialog';
import Spinner from '../common/spinner';
import Header from '../header';

const minardLogo = require('../../../../static/minard-logo-auth0.png');
const styles = require('./index.scss');

interface GeneratedStateProps {
  isLoggingIn: boolean;
  isUserLoggedIn: boolean;
}

interface GeneratedDispatchProps {
  login: (
    email: string,
    idToken: string,
    accessToken: string,
    expiresAt: number,
  ) => void;
  loadTeamInformation: (redirect?: string) => void;
}

interface Params {
  returnPath?: string;
}

type PassedProps = RouteComponentProps<Params>;

type Props = GeneratedStateProps & GeneratedDispatchProps & PassedProps;

interface State {
  loadingStatus: LoadingStatus;
}

enum LoadingStatus { AUTH0, BACKEND }

class LoginView extends React.Component<Props, State> {
  private lock: Auth0LockStatic;

  constructor(props: Props) {
    super(props);

    this.state = {
      loadingStatus: LoadingStatus.AUTH0,
    };
  }

  public componentDidMount() {
    this.lock = new Auth0Lock(
      process.env.AUTH0_CLIENT_ID,
      process.env.AUTH0_DOMAIN,
      ({
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
        allowedConnections: ['Username-Password-Authentication'],
        closable: false,
        container: 'login-container',
        theme: {
          logo: minardLogo,
          primaryColor: '#40C1AC',
        },
        languageDictionary: {
          title: 'Minard by Lucify',
        },
      }) as any,
    );

    this.lock.on('authenticated', this.onAuthentication.bind(this));
    this.lock.on('authorization_error', this.onError.bind(this));
    this.lock.on('unrecoverable_error', this.onError.bind(this));
    this.lock.show();
  }

  private onError(error: Auth0Error) {
    console.error('Unable to login', error);
    // TODO: handle this
  }

  private onAuthentication(authResult: any) {
    const {
      loadTeamInformation,
      login,
      match: { params: { returnPath } },
    } = this.props;
    const { idToken, accessToken, expiresIn } = authResult;

    this.lock.getUserInfo(
      accessToken,
      (error: Auth0Error, profile: Auth0UserProfile) => {
        if (error) {
          console.error('Unable to get user information', error);
          // TODO: handle this

          return;
        }

        const { email } = profile;
        if (email) {
          // expiresIn is seconds from now
          const expiresAt = moment().add(expiresIn, 'seconds').valueOf();
          const redirectTarget =
            (returnPath && decodeURIComponent(returnPath)) || '/';

          login(email, idToken, accessToken, expiresAt);
          loadTeamInformation(redirectTarget);
          this.lock.hide();
          this.setState({ loadingStatus: LoadingStatus.BACKEND });
        } else {
          console.error('No email address returned from Auth0!', profile);
          // TODO: handle this
        }
      },
    );
  }

  private restartLogin() {
    window.location.href = '/login';
  }

  public render() {
    const { loadingStatus } = this.state;
    const { isUserLoggedIn, isLoggingIn } = this.props;

    if (loadingStatus === LoadingStatus.BACKEND) {
      if (!isUserLoggedIn && !isLoggingIn) {
        return (
          <div>
            <Header />
            <ErrorDialog
              title="Error"
              actionText="Try again"
              action={this.restartLogin}
            >
              <p>
                Unable to load Minard. If this problem persists, contact
                {' '}<a href="mailto:support@minard.io">support@minard.io</a>.
              </p>
            </ErrorDialog>
          </div>
        );
      }

      return (
        <div>
          <Header />
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
  isLoggingIn: Requests.selectors.isLoggingIn(state),
  isUserLoggedIn: User.selectors.isUserLoggedIn(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<any>,
): GeneratedDispatchProps => ({
  login: (
    email: string,
    idToken: string,
    accessToken: string,
    expiresAt: number,
  ) => {
    dispatch(User.actions.login(email, idToken, accessToken, expiresAt));
  },
  loadTeamInformation: (redirect?: string) => {
    dispatch(User.actions.loadTeamInformation(redirect));
  },
});

export default connect<
  GeneratedStateProps,
  GeneratedDispatchProps,
  PassedProps
>(mapStateToProps, mapDispatchToProps)(LoginView);
