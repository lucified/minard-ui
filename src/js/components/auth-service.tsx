import * as React from 'react';
import * as qs from 'querystring';

const auth0 = require('auth0-js');
const verifier = require('idtoken-verifier');

interface Props {
  clientID: string;
  domain: string;
  audience: string;
  redirectUri: string;
  responseType: string;
  scope: string;
}

interface State {
  hash?: string;
  parsedHash?: any;
  idToken?: any;
  accessToken?: any;
}

export default class AuthService extends React.Component<Props, State> {
  public static defaultProps: Props = {
    clientID: 'F7LsDkVxqwFrfe0qjtI1bguJSL7xGkA3',
    domain: 'lucify.eu.auth0.com',
    audience: 'https://charles-staging.minard.io',
    redirectUri: 'https://8fed7a61.ngrok.io/auth-callback',
    responseType: 'token id_token',
    scope: 'openid profile email'
  }

  constructor(props: Partial<Props>) {
    super(props);
    this.login = this.login.bind(this);
    this.state = {};
  }

  private getProps(props: Props) {
    const {
      clientID,
      domain,
      audience,
      redirectUri,
      responseType,
      scope,
    } = props;

    return {
      clientID,
      domain,
      audience,
      redirectUri,
      responseType,
      scope,
    };

  }

  private getAuth0() {
    return new auth0.WebAuth(this.getProps(this.props));
  }

  login(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const auth0 = this.getAuth0();
    auth0.authorize({group: '1233453xyx'});
  }

  public componentDidMount() {
    if(window && window.location && window.location.hash) {
      const hash = window.location.hash.replace(/^#?\/?/, '');
      const parsedHash = qs.parse(hash);
      const state = {
        accessToken: undefined,
        idToken: undefined,
      };
      const v = new verifier({
        issuer: this.props.domain,
        audience: this.props.audience,
      });

      if(parsedHash.access_token) {
        state.accessToken = v.decode(parsedHash.access_token)
      }
      if(parsedHash.id_token) {
        state.idToken = v.decode(parsedHash.id_token)
      }

      this.setState(state);
    }
  }

  public render() {
    const elements: JSX.Element[] = [];
    if(this.state.accessToken) {
      elements.push(
        <pre key={1}>
          {JSON.stringify(this.state.accessToken, undefined, 2)}
        </pre>
      );
    }
    if(this.state.idToken) {
      elements.push(
        <pre key={2}>
          {JSON.stringify(this.state.idToken, undefined, 2)}
        </pre>
      );
    }
    if(elements.length > 0) {
      return <div>{elements}</div>;
    }
    return (
      <a href="/" onClick={this.login}>
        Login
      </a>
    );
  }
}
