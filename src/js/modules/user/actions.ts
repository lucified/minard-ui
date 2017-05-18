import {
  ClearStoredDataAction,
  LoadTeamInformationAction,
  LoginAction,
  LogoutAction,
  RedirectToLoginAction,
  SetGitPasswordAction,
  SetTeamAction,
  SetUserEmailAction,
  SignupUserAction,
} from './types';

export const SET_USER_EMAIL = 'USER/SET_USER_EMAIL';
export const setUserEmail = (email: string, expiresAt: number): SetUserEmailAction => ({
  type: SET_USER_EMAIL,
  email,
  expiresAt,
});

export const SET_TEAM = 'USER/SET_TEAM';
export const setTeam = (id: string, name: string, invitationToken?: string): SetTeamAction => ({
  type: SET_TEAM,
  id,
  name,
  invitationToken,
});

export const SIGNUP_USER = 'USER/SIGNUP_USER';
export const signupUser = (
  email: string,
  idToken: string,
  accessToken: string,
  expiresAt: number,
): SignupUserAction => ({
  type: SIGNUP_USER,
  email,
  idToken,
  accessToken,
  expiresAt,
});

export const LOGIN = 'USER/LOGIN';
export const login = (email: string, idToken: string, accessToken: string, expiresAt: number): LoginAction => ({
  type: LOGIN,
  email,
  idToken,
  accessToken,
  expiresAt,
});

export const LOGOUT = 'USER/LOGOUT';
export const logout = (): LogoutAction => ({
  type: LOGOUT,
});

// Clears all stored entity and user data from the Redux state
export const CLEAR_STORED_DATA = 'USER/CLEAR_STORED_DATA';
export const clearStoredData = (): ClearStoredDataAction => ({
  type: CLEAR_STORED_DATA,
});

export const LOAD_TEAM_INFORMATION = 'USER/LOAD_TEAM_INFORMATION';
export const loadTeamInformation = (): LoadTeamInformationAction => ({
  type: LOAD_TEAM_INFORMATION,
});

export const SET_GIT_PASSWORD = 'USER/SET_GIT_PASSWORD';
export const setGitPassword = (password: string): SetGitPasswordAction => ({
  type: SET_GIT_PASSWORD,
  password,
});

export const REDIRECT_TO_LOGIN = 'USER/REDIRECT_TO_LOGIN';
export const redirectToLogin = (returnPath?: string): RedirectToLoginAction => ({
  type: REDIRECT_TO_LOGIN,
  returnPath,
});
