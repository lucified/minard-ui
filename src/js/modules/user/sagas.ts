import { push } from 'react-router-redux';
import { call, Effect, fork, put, take, takeEvery } from 'redux-saga/effects';

import { clearStoredCredentials, storeCredentials } from '../../api/auth';
import { Api, ApiTeam, SignupResponse } from '../../api/types';
import { login as intercomLogin, logout as intercomLogout } from '../../intercom';
import Errors from '../errors';
import Requests from '../requests';
import {
  clearStoredData,
  clearUserDetails,
  LOAD_TEAM_INFORMATION,
  LOGIN,
  LOGOUT,
  REDIRECT_TO_LOGIN,
  setGitPassword,
  setTeam,
  setUserEmail,
  SIGNUP_USER,
} from './actions';
import { LoadTeamInformationAction, LoginAction, RedirectToLoginAction, SignupUserAction } from './types';

export default function createSagas(api: Api) {
  // User
  function *loadTeamInformation(_action: LoadTeamInformationAction): IterableIterator<Effect> {
    yield put(Requests.actions.User.LoadTeamInformation.REQUEST.actionCreator());

    const { response, error, details, unauthorized } = yield call(api.Team.fetch);

    if (response) {
      const { id, name, 'invitation-token': invitationToken } = response as ApiTeam;
      yield put(setTeam(String(id), name, invitationToken));
      yield put(Requests.actions.User.LoadTeamInformation.SUCCESS.actionCreator());

      return true;
    } else {
      // TODO: handle failure, e.g. not authorized or member of team
      yield put(Requests.actions.User.LoadTeamInformation.FAILURE.actionCreator(error, details, unauthorized));

      return false;
    }
  }

  function *signupUser(action: SignupUserAction): IterableIterator<Effect> {
    yield call(login, action);

    yield put(Errors.actions.clearSignupError());
    const { response, error, details } = yield call(api.User.signup);

    if (response) {
      const { password, team: { id, name } } = response as SignupResponse;
      yield put(setTeam(String(id), name));
      yield put(setGitPassword(password));

      return true;
    } else {
      console.error('signupUser error', error, details);
      yield put(Errors.actions.signupError(error, details));

      return false;
    }
  }

  function *redirectToLogin(action: RedirectToLoginAction): IterableIterator<Effect> {
    const { returnPath } = action;

    if (returnPath) {
      yield put(push(`/login/${encodeURIComponent(returnPath)}`));
    } else {
      yield put(push('/login'));
    }
  }

  function *login(action: LoginAction | SignupUserAction): IterableIterator<Effect> {
    const { email, accessToken, idToken, expiresAt } = action;

    intercomLogin(email);
    storeCredentials(idToken, accessToken, email, expiresAt);
    yield put(setUserEmail(email, expiresAt));
  }

  function *logout(): IterableIterator<Effect> {
    const { error, unauthorized } = yield call(api.User.logout);

    if (error) {
      if (unauthorized) {
        console.error('Unable to clear cookie: Unauthorized');
      } else {
        console.error(`Unable to clear cookie: ${error}`);
      }
    }

    yield call(intercomLogout);
    yield put(clearStoredData());
    yield put(clearUserDetails());
    yield call(clearStoredCredentials);
  }

  function* watchForLoadTeamInformation(): IterableIterator<Effect> {
    while (true) {
      const action = yield take(LOAD_TEAM_INFORMATION);
      // Block until it's done, skipping any further actions
      yield call(loadTeamInformation, action);
    }
  }

  function* watchForSignupUser(): IterableIterator<Effect> {
    while (true) {
      const action = yield take(SIGNUP_USER);
      // Block until it's done, skipping any further actions
      yield call(signupUser, action);
    }
  }

  return {
    functions: {
      loadTeamInformation,
      login,
      logout,
      redirectToLogin,
      signupUser,
    },
    sagas: [
      takeEvery(LOGIN, login),
      takeEvery(LOGOUT, logout),
      takeEvery(REDIRECT_TO_LOGIN, redirectToLogin),
      fork(watchForLoadTeamInformation),
      fork(watchForSignupUser),
    ],
  };
}
