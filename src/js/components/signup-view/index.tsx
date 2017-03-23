// TODO: import this with typings once the latest auth0-js typings work with auth0-lock typings
const Auth0 = require('auth0-js');
import * as classNames from 'classnames';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';

import { storeCredentials } from '../../api/auth';
import { login as intercomLogin } from '../../intercom';
import Errors from '../../modules/errors';
import User from '../../modules/user';
import { StateTree } from '../../reducers';
import ErrorDialog from './error-dialog';

const styles = require('./index.scss');

interface GeneratedDispatchProps {
  navigateTo: (url: string) => void;
  setUserEmail: (email: string) => void;
  signupUser: () => void;
}

interface GeneratedStateProps {
  password?: string;
  email?: string;
  error?: string;
}

interface PassedProps {
  params: {
    teamToken?: string;
  };
}

type Props = GeneratedDispatchProps & PassedProps & GeneratedStateProps;

interface State {
  loadingStatus: LoadingStatus;
  auth0Error?: string;
}

enum LoadingStatus {
  AUTH0,
  BACKEND,
};

class SignupView extends React.Component<Props, State> {
  private auth0: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      loadingStatus: LoadingStatus.AUTH0,
    };

    this.redirectToApp = this.redirectToApp.bind(this);
  }

  public componentWillMount() {
    const { setUserEmail, signupUser, params: { teamToken } } = this.props;

    this.auth0 = new Auth0.WebAuth({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      audience: process.env.AUTH0_AUDIENCE,
      responseType: 'token id_token',
      scope: 'openid profile email',
      redirectUri: `${window.location.origin}/signup`,
    });

    if (teamToken) {
      this.setState({ auth0Error: undefined });
      this.auth0.authorize({
        connection: 'Username-Password-Authentication',
        team_token: teamToken,
      });
    } else {
      this.auth0.parseHash((auth0Error: Auth0Error, data: any) => {
        if (auth0Error) {
          console.error('Unable to sign up', auth0Error);
          this.setState({ auth0Error: auth0Error.message });
        }

        if (!data) {
          return;
        }

        const { idToken, accessToken, expiresIn } = data;
        if (accessToken) {
          // At this point accessToken includes the teamToken
          this.auth0.client.userInfo(accessToken, (userInfoError: Auth0Error, profile: Auth0UserProfile) => {
            if (userInfoError) {
              console.error('Unable to get user information', userInfoError);
              this.setState({ auth0Error: userInfoError.message });
            } else {
              const { email } = profile;

              intercomLogin(email);
              storeCredentials(idToken, accessToken, email, expiresIn);
              setUserEmail(email);

              // Will use the teamToken in the accessToken to add the user to the
              // appropriate team and return the user's git password which is then
              // stored to the Redux state
              signupUser();

              this.setState({ loadingStatus: LoadingStatus.BACKEND });
            }
          });
        } else {
          console.error('Missing accessToken in payload', data);
          this.setState({ auth0Error: 'Missing access token' });
        }

        window.location.hash = '';
      });
    }
  }

  private redirectToApp() {
    this.props.navigateTo('/');
  }

  public render() {
    const { password, email, error } = this.props;
    const { loadingStatus, auth0Error } = this.state;

    if (auth0Error || error) { // TODO: Add "back to signup" action
      return (
        <div className={styles['login-message']}>
          {this.getHeader()}
          <ErrorDialog title="Oops">
            <p>{auth0Error || error}</p>
          </ErrorDialog>
        </div>
      );
    }

    if (password) {
      return (
        <div>
          {this.getHeader()}
          <ErrorDialog title="Important" actionText="Open Minard" action={this.redirectToApp}>
            <p>
              Success! Your Minard user account has been created. To access the Minard
              Git repository, you will need to use the following username and password.
            </p>
            <p>
              <strong>
                Please store this password in some place safe. This is the only time you will
                see this password.
              </strong>
            </p>
            <p>
              <strong>Username:</strong> <code>{email}</code><br />
              <strong>Password:</strong> <code>{password}</code>
            </p>
            <p>
              Once you have stored this information, you can continue to Minard.
            </p>
          </ErrorDialog>
        </div>
      );
    }

    if (loadingStatus === LoadingStatus.BACKEND) {
      // TODO: better loading indicator
      return (
        <div>
          {this.getHeader()}
          <ErrorDialog>
            <p>
              Creating user...
            </p>
          </ErrorDialog>
        </div>
      );
    }

    // TODO: Say something
    return null;
  }

  private getHeader() {
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
};

const mapStateToProps = (state: StateTree): GeneratedStateProps => {
  const error = Errors.selectors.getSignupError(state);

  return {
    password: User.selectors.getUserGitPassword(state),
    email: User.selectors.getUserEmail(state),
    error: error && error.error,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  signupUser: () => { dispatch(User.actions.signupUser()); },
  navigateTo: (url: string) => { dispatch(push(url)); },
  setUserEmail: (email: string) => { dispatch(User.actions.setUserEmail(email)); },
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SignupView);