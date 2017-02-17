// TODO: import this with typings once the latest auth0-js typings work with auth0-lock typings
const Auth0 = require('auth0-js');
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';

import { storeCredentials } from '../../api/auth';
import { login as intercomLogin } from '../../intercom';
import User from '../../modules/user';
import { StateTree } from '../../reducers';

interface GeneratedDispatchProps {
  navigateTo: (url: string) => void;
  setUserEmail: (email: string) => void;
  signupUser: () => void;
}

interface GeneratedStateProps {
  password?: string;
  email?: string;
}

interface PassedProps {
  params: {
    teamToken?: string;
  };
}

type Props = GeneratedDispatchProps & PassedProps & GeneratedStateProps;

interface State {
  loadingStatus: LoadingStatus;
  error?: string;
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
      this.setState({ error: undefined });
      this.auth0.authorize({
        connection: 'Username-Password-Authentication',
        team_token: teamToken,
      });
    } else {
      this.auth0.parseHash((error: Auth0Error, data: any) => {
        console.log(error, data);
        if (error) {
          console.error('Unable to sign up', error);
          this.setState({ error: error.message });
        }

        const { idToken, accessToken, expiresIn } = data;
        if (accessToken) {
          // At this point accessToken includes the teamToken
          this.auth0.client.userInfo(accessToken, (userInfoError: Auth0Error, profile: Auth0UserProfile) => {
            if (userInfoError) {
              console.error('Unable to get user information', userInfoError);
              this.setState({ error: userInfoError.message });
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
          this.setState({ error: 'Missing access token' });
        }

        window.location.hash = '';
      });
    }
  }

  private redirectToApp() {
    this.props.navigateTo('/');
  }

  public render() {
    const { password, email } = this.props;
    const { loadingStatus, error } = this.state;

    if (error) {
      // TODO: better error styling
      return (
        <div>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      );
    }

    if (password) {
      // TODO: style this
      return (
        <div>
          <h2>Important</h2>
          <p>
            Success! Your Minard user account has been created. To access the Minard
            Git repository, you will need to use the following username and password.
            <strong>
              Please store this password in some place safe. This is the only time you will
              see this password.
            </strong>
          </p>
          <p>
            <strong>Username:</strong> <pre>{email}</pre><br />
            <strong>Password:</strong> <pre>{password}</pre>
          </p>
          <p>
            Once you have stored this information, you can continue to Minard.
          </p>
          <button onClick={this.redirectToApp}>Open minard</button>
        </div>
      );
    }

    if (loadingStatus === LoadingStatus.BACKEND) {
      // TODO: better loading indicator
      return (
        <div>Creating user...</div>
      );
    }

    return null;
  }
};

const mapStateToProps = (state: StateTree): GeneratedStateProps => ({
  password: User.selectors.getUserGitPassword(state),
  email: User.selectors.getUserEmail(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  signupUser: () => { dispatch(User.actions.signupUser()); },
  navigateTo: (url: string) => { dispatch(push(url)); },
  setUserEmail: (email: string) => { dispatch(User.actions.setUserEmail(email)); },
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SignupView);
