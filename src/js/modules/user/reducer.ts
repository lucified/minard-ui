import { getEmail } from '../../api/auth';
import { login as intercomLogin } from '../../intercom';
import { CLEAR_USER_DETAILS, SET_GIT_PASSWORD, SET_TEAM, SET_USER_EMAIL } from './actions';
import { SetGitPasswordAction, SetTeamAction, SetUserEmailAction, UserState } from './types';

// TODO: Move Intercom stuff elsewhere?
const existingUserEmail = getEmail();
if (existingUserEmail) {
  intercomLogin(existingUserEmail);
}

const initialState: UserState = {
  email: existingUserEmail || undefined,
};

const reducer = (state: UserState = initialState, action: any): UserState => {
  switch (action.type) {
    case SET_USER_EMAIL:
      const { email } = action as SetUserEmailAction;
      return {
        ...state,
        email,
      };
    case SET_TEAM:
      const { id, name } = action as SetTeamAction;
      return {
        ...state,
        team: {
          id,
          name,
        },
      };
    case SET_GIT_PASSWORD:
      const { password } = action as SetGitPasswordAction;
      return {
        ...state,
        gitPassword: password,
      };
    case CLEAR_USER_DETAILS:
      return {};
    default:
      return state;
  }
};

export default reducer;
