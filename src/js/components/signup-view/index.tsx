import { Auth0Error, Auth0UserProfile, WebAuth } from 'auth0-js';
import * as moment from 'moment';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import Errors from '../../modules/errors';
import User from '../../modules/user';
import { StateTree } from '../../reducers';
import ErrorDialog from '../common/error-dialog';
import Spinner from '../common/spinner';
import Header from '../header';

interface GeneratedDispatchProps {
  signupUser: (
    email: string,
    idToken: string,
    accessToken: string,
    expiresAt: number,
  ) => void;
}

interface GeneratedStateProps {
  email?: string;
  error?: string;
}

interface Params {
  teamToken?: string;
}

type PassedProps = RouteComponentProps<Params>;

type Props = GeneratedDispatchProps & GeneratedStateProps & PassedProps;

interface State {
  loadingStatus: LoadingStatus;
  auth0Error?: string;
}

enum LoadingStatus {
  AUTH0,
  BACKEND,
}

class SignupView extends React.Component<Props, State> {
  private auth0?: WebAuth;

  constructor(props: Props) {
    super(props);
    this.state = {
      loadingStatus: LoadingStatus.AUTH0,
    };
  }

  public componentWillMount() {
    const { signupUser, match: { params: { teamToken } } } = this.props;

    this.auth0 = new WebAuth({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      audience: process.env.AUTH0_AUDIENCE,
      responseType: 'token id_token',
      scope: 'openid profile email',
      redirectUri: `${window.location.origin}/signup`,
    });

    if (teamToken) {
      // This is loaded initially when the user arrives at the page
      this.setState({ auth0Error: undefined });
      this.auth0.authorize({
        connection: 'Username-Password-Authentication',
        team_token: teamToken,
      });
    } else {
      // Once the user has signed up at Auth0, they are returned to this page
      // with a hash in the URL. This function parses that hash and initiates
      // the signup with the Minard backend. The team token is included in the
      // JWT.
      this.auth0.parseHash({}, (auth0Error: Auth0Error, data: any) => {
        if (auth0Error) {
          console.error('Unable to sign up', auth0Error);
          this.setState({ auth0Error: auth0Error.errorDescription });
        }

        if (!data) {
          this.setState({ auth0Error: 'No data found!' });
          return;
        }

        const { idToken, accessToken, expiresIn } = data;
        if (accessToken) {
          // At this point accessToken includes the teamToken
          this
            .auth0!.client.userInfo(
            accessToken,
            (userInfoError: Auth0Error, profile: Auth0UserProfile) => {
              if (userInfoError) {
                console.error('Unable to get user information', userInfoError);
                this.setState({ auth0Error: userInfoError.description });
              } else {
                const { email } = profile;

                if (email) {
                  const expiresAt = moment()
                    .add(expiresIn, 'seconds')
                    .valueOf();

                  // Will use the teamToken in the accessToken to add the user
                  // to the appropriate team. The signup saga will store the
                  // team ID into the Redux state and redirect the user into
                  // the app.
                  signupUser(email, idToken, accessToken, expiresAt);

                  this.setState({ loadingStatus: LoadingStatus.BACKEND });
                } else {
                  console.error(
                    'No email address returned from Auth0!',
                    profile,
                  );
                  this.setState({ auth0Error: 'Unable to get email address' });
                }
              }
            },
          );
        } else {
          console.error('Missing accessToken in payload', data);
          this.setState({ auth0Error: 'Missing access token' });
        }

        window.location.hash = '';
      });
    }
  }

  public render() {
    const { error } = this.props;
    const { loadingStatus, auth0Error } = this.state;

    if (auth0Error || error) {
      // TODO: Add "back to signup" action
      return (
        <div>
          <Header />
          <ErrorDialog title="Something went wrong">
            <p>{auth0Error || error}</p>
            <p>
              Please try signing up again. If that doesn't work, contact{' '}
              <a href="mailto:support@minard.io">support@minard.io</a>.
            </p>
          </ErrorDialog>
        </div>
      );
    }

    if (loadingStatus === LoadingStatus.BACKEND) {
      return (
        <div>
          <Header />
          <Spinner />
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = (state: StateTree): GeneratedStateProps => {
  const error = Errors.selectors.getSignupError(state);
  return {
    email: User.selectors.getUserEmail(state),
    error: error && error.error,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<any>,
): GeneratedDispatchProps => ({
  signupUser: (
    email: string,
    idToken: string,
    accessToken: string,
    expiresAt: number,
  ) => {
    dispatch(User.actions.signupUser(email, idToken, accessToken, expiresAt));
  },
});

export default connect<
  GeneratedStateProps,
  GeneratedDispatchProps,
  PassedProps
>(mapStateToProps, mapDispatchToProps)(SignupView);
