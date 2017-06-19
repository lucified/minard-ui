import * as moment from 'moment';

import { StateTree } from '../../reducers';
import { Team, UserState } from './types';

const selectUserTree = (state: StateTree): UserState => state.user;

export const getUserEmail = (state: StateTree): string | undefined =>
  selectUserTree(state).email;
export const isUserLoggedIn = (state: StateTree): boolean =>
  !!selectUserTree(state).team;
export const hasStoredUserCredentials = (state: StateTree): boolean => {
  const { email, expiresAt } = selectUserTree(state);

  if (!email || expiresAt === undefined) {
    return false;
  }

  const now = moment();

  return now.isBefore(moment(expiresAt));
};
export const getTeam = (state: StateTree): Team | undefined =>
  selectUserTree(state).team;
