import {
  ClearStoredDataAction,
  ClearUserDetailsAction,
  LoadTeamInformationAction,
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

export const CLEAR_USER_DETAILS = 'USER/CLEAR_USER_DETAILS';
export const clearUserDetails = (): ClearUserDetailsAction => ({
  type: CLEAR_USER_DETAILS,
});

export const CLEAR_STORED_DATA = 'USER/CLEAR_STORED_DATA';
export const clearStoredData = (): ClearStoredDataAction => ({
  type: CLEAR_STORED_DATA,
});

export const LOAD_TEAM_INFORMATION = 'USER/LOAD_TEAM_INFORMATION';
export const loadTeamInformation = (): LoadTeamInformationAction => ({
  type: LOAD_TEAM_INFORMATION,
});

export const SIGNUP_USER = 'USER/SIGNUP_USER';
export const signupUser = (): SignupUserAction => ({
  type: SIGNUP_USER,
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
