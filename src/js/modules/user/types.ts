// State
export interface UserState {
  email?: string;
  team?: Team;
  gitPassword?: string;
  expiresAt?: number; // moment.valueOf()
  // TODO: add full name
}

export interface Team {
  id: string;
  name: string;
  invitationToken?: string;
}

// Actions
export interface SetUserEmailAction {
  type: 'USER/SET_USER_EMAIL';
  email: string;
  expiresAt: number;
}

export interface SetTeamAction {
  type: 'USER/SET_TEAM';
  id: string;
  name: string;
  invitationToken?: string;
}

export interface SignupUserAction {
  type: 'USER/SIGNUP_USER';
  email: string;
  idToken: string;
  accessToken: string;
  expiresAt: number;
}

export interface LoginAction {
  type: 'USER/LOGIN';
  email: string;
  idToken: string;
  accessToken: string;
  expiresAt: number;
}

export interface LogoutAction {
  type: 'USER/LOGOUT';
}

export interface ClearStoredDataAction {
  type: 'USER/CLEAR_STORED_DATA';
}

export interface LoadTeamInformationAction {
  type: 'USER/LOAD_TEAM_INFORMATION';
}

export interface SetGitPasswordAction {
  type: 'USER/SET_GIT_PASSWORD';
  password: string;
}

export interface RedirectToLoginAction {
  type: 'USER/REDIRECT_TO_LOGIN';
  returnPath?: string;
}
