import { getEmail, getExpirationTime } from '../../api/auth';
import { login as intercomLogin } from '../../intercom';
import { CLEAR_STORED_DATA, SET_GIT_PASSWORD, SET_TEAM, SET_USER_EMAIL } from './actions';
import { SetGitPasswordAction, SetTeamAction, SetUserEmailAction, UserState } from './types';

// TODO: Move Intercom stuff elsewhere?
const existingUserEmail = getEmail();
if (existingUserEmail) {
  intercomLogin(existingUserEmail);
}

const existingExpirationAt = getExpirationTime();

const initialState: UserState = {
  email: existingUserEmail || undefined,
  expiresAt: existingExpirationAt || undefined,
};

const reducer = (state: UserState = initialState, action: any): UserState => {
  switch (action.type) {
    case SET_USER_EMAIL:
      const { email, expiresAt } = action as SetUserEmailAction;
      return {
        ...state,
        email,
        expiresAt,
      };
    case SET_TEAM:
      const { id, name, invitationToken } = action as SetTeamAction;
      return {
        ...state,
        team: {
          id,
          name,
          invitationToken,
        },
      };
    case SET_GIT_PASSWORD:
      const { password } = action as SetGitPasswordAction;
      return {
        ...state,
        gitPassword: password,
      };
    case CLEAR_STORED_DATA:
      return {};
    default:
      return state;
  }
};

export default reducer;
