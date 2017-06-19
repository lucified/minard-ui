import { expect } from 'chai';
import { clearStoredData, setTeam, setUserEmail } from './actions';
import reducer from './reducer';
import { UserState } from './types';

describe('User reducer', () => {
  const stateWithUser: UserState = {
    email: 'email@domain.com',
    expiresAt: 123,
    team: {
      id: 'teamid',
      name: 'team name',
      invitationToken: 'testtoken',
    },
  };

  const initialState: UserState = {};

  it('returns the correct default state', () => {
    expect(reducer(undefined as any, { type: 'foobar' })).to.deep.equal(
      initialState,
    );
  });

  describe('setUserEmail', () => {
    it('should update if the email changes', () => {
      const action = setUserEmail('new@email.com', 99999999);
      const newState = reducer(initialState, action);
      expect(newState.email).to.equal(action.email);
      expect(newState.expiresAt).to.equal(action.expiresAt);
      expect(newState).to.not.equal(initialState);
    });

    it('should do nothing if nothing changes', () => {
      const action = setUserEmail(
        stateWithUser.email!,
        stateWithUser.expiresAt!,
      );
      const newState = reducer(stateWithUser, action);
      expect(newState).to.deep.equal(stateWithUser);
      expect(newState).to.equal(stateWithUser);
    });
  });

  describe('setTeam', () => {
    it('should update if team information changes', () => {
      const action = setTeam('newId', 'newName', 'newToken');
      const newState = reducer(initialState, action);
      expect(newState.team!.id).to.equal(action.id);
      expect(newState.team!.name).to.equal(action.name);
      expect(newState.team!.invitationToken).to.equal(action.invitationToken);
      expect(newState).to.not.equal(initialState);
    });

    it('should do nothing if nothing changes', () => {
      const existingTeam = stateWithUser.team!;
      const action = setTeam(
        existingTeam.id,
        existingTeam.name,
        existingTeam.invitationToken,
      );
      const newState = reducer(stateWithUser, action);
      expect(newState).to.deep.equal(stateWithUser);
      expect(newState).to.equal(stateWithUser);
    });
  });

  it(`clears data on clearStoredData`, () => {
    const action = clearStoredData();
    expect(reducer(stateWithUser, action)).to.deep.equal(initialState);
    expect(reducer(undefined as any, action)).to.deep.equal(initialState);
  });
});
