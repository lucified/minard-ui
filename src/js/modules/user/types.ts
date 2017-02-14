// State
export interface UserState {
  email?: string;
  team?: Team;
  // TODO: add full name
};

export interface Team {
  id: string;
  name: string;
}

// Actions
export interface SetUserEmailAction {
  type: 'USER/SET_USER_EMAIL';
  email: string;
};

export interface SetTeamAction {
  type: 'USER/SET_TEAM';
  id: string;
  name: string;
}

export interface ClearUserDetailsAction {
  type: 'USER/CLEAR_USER_DETAILS';
}

export interface LoadTeamInformationAction {
  type: 'USER/LOAD_TEAM_INFORMATION';
};