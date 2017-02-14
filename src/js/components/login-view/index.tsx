import Auth0Lock from 'auth0-lock';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';

import { clearCredentials, storeCredentials } from '../../api/auth';
import { login as intercomLogin, logout as intercomLogout } from '../../intercom';
import User from '../../modules/user';

const styles = require('./index.scss');

const CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const DOMAIN = process.env.AUTH0_DOMAIN;
const AUDIENCE = process.env.AUTH0_AUDIENCE;

interface GeneratedDispatchProps {
  navigateTo: (url: string) => void;
  setUserEmail: (email: string) => void;
  clearUserDetails: () => void;
}

type Props = GeneratedDispatchProps;

class LoginView extends React.Component<Props, void> {
  private lock: Auth0LockStatic;

  constructor(props: Props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  public componentDidMount() {
    this.lock = new Auth0Lock(CLIENT_ID, DOMAIN, {
      // oidcConformant is still in preview stage, which is why it is not documented
      // or found in the typings. Remove the `as any` below once it's included.
      // Read more: https://auth0.com/forum/t/lock-not-always-passing-audience/5121/17
      oidcConformant: true,
      additionalSignUpFields: [
        {
          name: 'full_name',
          placeholder: 'Your name',
          validator: (name: string) => ({
            valid: name.length > 0,
            hint: 'Required',
          }),
        },
      ],
      auth: {
        responseType: 'token',
        params: {
          scope: 'openid email', // TODO: get real name once we can (somehow)
          audience: AUDIENCE,
        },
      },
      allowSignUp: true,  // TODO: change to false
      allowedConnections: [
        'Username-Password-Authentication',
      ],
      closable: false,
      container: 'login-container',
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
    const { navigateTo, setUserEmail } = this.props;
    const { idToken, accessToken, expiresIn } = authResult;

    this.lock.getUserInfo(accessToken, (error: Auth0Error, profile: Auth0UserProfile) => {
      if (error) {
        console.error('Unable to get user information', error);
        // TODO: handle this
      } else {
        const { email } = profile;

        intercomLogin(email);
        storeCredentials(idToken, accessToken, email, expiresIn);
        setUserEmail(email);

        navigateTo('/');
        // TODO: redirect to page where user came from
      }
    });
  }

  private logout() {
    const { clearUserDetails } = this.props;

    intercomLogout();
    clearUserDetails();
    clearCredentials();
  }

  public render() {
    return (
      <div className={styles.root}>
        <div className={styles['login-container']} id="login-container" />
        <button onClick={this.logout}>Logout</button>
      </div>
    );
  }
};

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  navigateTo: (url: string) => { dispatch(push(url)); },
  setUserEmail: (email: string) => { dispatch(User.actions.setUserEmail(email)); },
  clearUserDetails: () => { dispatch(User.actions.clearUserDetails()); },
});

export default connect(() => ({}), mapDispatchToProps)(LoginView);
