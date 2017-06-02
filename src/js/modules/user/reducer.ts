import { getEmail, getExpirationTime } from '../../api/auth';
import { login as intercomLogin } from '../../intercom';
import {
  CLEAR_STORED_DATA,
  SET_GIT_PASSWORD,
  SET_TEAM,
  SET_USER_EMAIL,
} from './actions';
import {
  SetGitPasswordAction,
  SetTeamAction,
  SetUserEmailAction,
  UserState,
} from './types';

// TODO: Move Intercom stuff elsewhere?
const existingUserEmail = getEmail();
if (existingUserEmail) {
  intercomLogin(existingUserEmail);
}

const existingExpirationAt = getExpirationTime();

const initialState: UserState = existingExpirationAt && existingUserEmail
  ? {
      email: existingUserEmail,
      expiresAt: existingExpirationAt,
    }
  : {};

const reducer = (state: UserState = initialState, action: any): UserState => {
  switch (action.type) {
    case SET_USER_EMAIL:
      const { email, expiresAt } = action as SetUserEmailAction;
      if (state.email !== email || state.expiresAt !== expiresAt) {
        return {
          ...state,
          email,
          expiresAt,
        };
      }

      return state;
    case SET_TEAM:
      const { id, name, invitationToken } = action as SetTeamAction;
      const existingTeam = state.team;
      if (
        !existingTeam ||
        existingTeam.id !== id ||
        existingTeam.name !== name ||
        existingTeam.invitationToken !== invitationToken
      ) {
        return {
          ...state,
          team: {
            id,
            name,
            invitationToken,
          },
        };
      }

      return state;
    case SET_GIT_PASSWORD:
      const { password } = action as SetGitPasswordAction;
      if (state.gitPassword !== password) {
        return {
          ...state,
          gitPassword: password,
        };
      }

      return state;
    case CLEAR_STORED_DATA:
      return {};
    default:
      return state;
  }
};

export default reducer;
