import Auth0Lock from 'auth0-lock';
import * as moment from 'moment';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';

import { clearStoredCredentials, storeCredentials } from '../../api/auth';
import { login as intercomLogin } from '../../intercom';
import User from '../../modules/user';

const minardLogo = require('../../../../static/minard-logo-auth0.png');
const styles = require('./index.scss');

interface GeneratedDispatchProps {
  navigateTo: (url: string) => void;
  setUserEmail: (email: string, expiresIn: number) => void;
}

interface PassedProps {
  params: {
    returnPath?: string;
  };
}

type Props = GeneratedDispatchProps & PassedProps;

class LoginView extends React.Component<Props, void> {
  private lock: Auth0LockStatic;

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

  private onAuthentication(authResult: any) {
    const { navigateTo, setUserEmail, params: { returnPath } } = this.props;
    const { idToken, accessToken, expiresIn } = authResult;

    this.lock.getUserInfo(accessToken, (error: Auth0Error, profile: Auth0UserProfile) => {
      if (error) {
        console.error('Unable to get user information', error);
        // TODO: handle this

        return;
      }

      const { email } = profile;
      // expiresIn is seconds from now
      const expiresAt = moment().add(expiresIn, 'seconds').valueOf();

      intercomLogin(email);
      storeCredentials(idToken, accessToken, email, expiresAt);
      setUserEmail(email, expiresAt);

      navigateTo(returnPath || '/');
    });
  }

  public render() {
    return (
      <div className={styles.root}>
        <div className={styles['login-container']} id="login-container" />
      </div>
    );
  }
};

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  navigateTo: (url: string) => { dispatch(push(url)); },
  setUserEmail: (email: string, expiresAt: number) => { dispatch(User.actions.setUserEmail(email, expiresAt)); },
});

export default connect(() => ({}), mapDispatchToProps)(LoginView);
