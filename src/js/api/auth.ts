import * as moment from 'moment';

const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';
const EXPIRES_AT_KEY = 'expires_at';
const EMAIL_KEY = 'email';

export function storeCredentials(idToken: string, accessToken: string, email: string, expiresAt: number) {
  localStorage.setItem(ID_TOKEN_KEY, idToken);
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(EMAIL_KEY, email);
  localStorage.setItem(EXPIRES_AT_KEY, moment(expiresAt).toISOString());
}

/**
 * Returns null if accessToken does not exist or has expired
 */
export function getAccessToken(): string | null {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);
  const now = moment();
  const isValid = !!accessToken && !!expiresAt && now.isBefore(moment(expiresAt));

  return isValid ? accessToken : null;
};

/**
 * Returns null if email does not exist or access token has expired
 */
export function getEmail(): string | null {
  return getAccessToken() && localStorage.getItem(EMAIL_KEY);
};

export function clearStoredCredentials() {
  localStorage.removeItem(ID_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
  localStorage.removeItem(EMAIL_KEY);
}
