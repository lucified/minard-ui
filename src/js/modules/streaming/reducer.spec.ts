import { expect } from 'chai';

import { CLEAR_STORED_DATA } from '../user';

import { setConnectionState } from './actions';
import reducer from './reducer';
import { ConnectionState, StreamingState } from './types';

describe.only('Streaming reducer', () => {
  const initialState: StreamingState = {
    state: ConnectionState.INITIAL_CONNECT,
  };

  describe('setConnectionState', () => {
    it('sets the state of the connection if different', () => {
      const action = setConnectionState(ConnectionState.OPEN);
      const newState = reducer(initialState, action);
      expect(newState).to.deep.equal({ state: action.state, error: undefined });
      expect(newState).to.not.equal(initialState);
    });

    it('saves the error message if present', () => {
      const action = setConnectionState(ConnectionState.CLOSED, 'unable to connect');
      const newState = reducer(initialState, action);
      expect(newState).to.deep.equal({ state: action.state, error: action.error });
      expect(newState).to.not.equal(initialState);
    });

    it('saves the error message even if the new state is the same', () => {
      const initialErrorState: StreamingState = { state: ConnectionState.CLOSED, error: 'first error' };
      const action = setConnectionState(ConnectionState.CLOSED, 'unable to connect');
      const newState = reducer(initialErrorState, action);
      expect(newState).to.deep.equal({ state: action.state, error: action.error });
      expect(newState).to.not.equal(initialErrorState);
    });

    it('it clears the error message', () => {
      const initialErrorState: StreamingState = { state: ConnectionState.CLOSED, error: 'first error' };
      const action = setConnectionState(ConnectionState.CLOSED);
      const newState = reducer(initialErrorState, action);
      expect(newState).to.deep.equal({ state: action.state, error: undefined });
      expect(newState).to.not.equal(initialErrorState);
    });

    it('does nothing if the state is already the same', () => {
      const action = setConnectionState(ConnectionState.INITIAL_CONNECT);
      const newState = reducer(initialState, action);
      expect(newState).to.deep.equal(initialState);
      expect(newState).to.equal(initialState);
    });
  });

  it(`clears data on ${CLEAR_STORED_DATA}`, () => {
    const action = { type: CLEAR_STORED_DATA };
    expect(reducer(initialState, action)).to.deep.equal({ state: ConnectionState.INITIAL_CONNECT });
    expect(reducer(undefined as any, action)).to.deep.equal({ state: ConnectionState.INITIAL_CONNECT });
  });
});
