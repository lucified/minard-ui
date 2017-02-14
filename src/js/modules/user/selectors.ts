import { StateTree } from '../../reducers';
import { Team, UserState } from './types';

const selectUserTree = (state: StateTree): UserState => state.user;

export const getUserEmail = (state: StateTree): string | undefined => selectUserTree(state).email;
export const isUserLoggedIn = (state: StateTree): boolean => !!selectUserTree(state).email;
export const getTeam = (state: StateTree): Team | undefined => selectUserTree(state).team;
