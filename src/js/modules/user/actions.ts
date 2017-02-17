import {
  ClearUserDetailsAction,
  LoadTeamInformationAction,
  SetGitPasswordAction,
  SetTeamAction,
  SetUserEmailAction,
  SignupUserAction,
} from './types';

export const SET_USER_EMAIL = 'USER/SET_USER_EMAIL';
export const setUserEmail = (email: string): SetUserEmailAction => ({
  type: SET_USER_EMAIL,
  email,
});

export const SET_TEAM = 'USER/SET_TEAM';
export const setTeam = (id: string, name: string): SetTeamAction => ({
  type: SET_TEAM,
  id,
  name,
});

export const CLEAR_USER_DETAILS = 'USER/CLEAR_USER_DETAILS';
export const clearUserDetails = (): ClearUserDetailsAction => ({
  type: CLEAR_USER_DETAILS,
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
