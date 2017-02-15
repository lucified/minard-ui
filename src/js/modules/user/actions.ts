import { ClearUserDetailsAction, LoadTeamInformationAction, SetTeamAction, SetUserEmailAction } from './types';

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
