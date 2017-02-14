import { getEmail } from '../../api/auth';
import { CLEAR_USER_DETAILS, SET_TEAM, SET_USER_EMAIL } from './actions';
import { SetTeamAction, SetUserEmailAction, UserState } from './types';

const initialState: UserState = {
  email: getEmail() || undefined,
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
    case CLEAR_USER_DETAILS:
      return {
        email: undefined,
        team: undefined,
      };
    default:
      return state;
  }
};

export default reducer;
