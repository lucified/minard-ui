import Auth0Lock from 'auth0-lock';
import * as React from 'react';
import { InjectedRouter, withRouter } from 'react-router';

const styles = require('./index.scss');

const CLIENT_ID = process.env.AUTH0_CLIENT_ID || 'ZaeiNyV7S7MpI69cKNHr8wXe5Bdr8tvW';
const DOMAIN = process.env.AUTH0_DOMAIN || 'lucify-dev.eu.auth0.com';
const AUDIENCE = process.env.AUTH0_AUDIENCE || 'https://charles-staging.minard.io';

interface Props {
  router: InjectedRouter;
};

class LoginView extends React.Component<Props, void> {
  private lock: Auth0LockStatic;

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
          scope: 'openid profile',
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

  private onError(error: Auth0Error) {;
    console.error('Unable to login', error);
  }

  private onAuthentication(authResult: any) {
    const { idToken, accessToken } = authResult;

    console.log('authResult', authResult);
    this.setToken(idToken, accessToken);

    this.lock.getUserInfo(accessToken, (error: Auth0Error, profile: Auth0UserProfile) => {
      if (error) {
        console.error('Unable to get user information', error);
      } else {
        console.log(profile);
      }

      // TODO: store information into Redux store
      const { router } = this.props;
      router.push('/projects');
      // TODO: redirect to page where user came from
    });
  }

  private setToken(idToken: string, accessToken: string) {
    localStorage.setItem('id_token', idToken);
    localStorage.setItem('access_token', accessToken);
  }

  private logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
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

export default withRouter(LoginView);
